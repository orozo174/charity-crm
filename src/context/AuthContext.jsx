import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { DEMO_USER } from "../data/demoData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Колдонуучунун профилин (роль, аты ж.б.) алып келүү
  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) {
      setUser(null);
      return;
    }
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (error) {
      setUser({ id: authUser.id, email: authUser.email, full_name: authUser.email, role: "volunteer" });
      return;
    }
    setUser({ ...profile, email: authUser.email });
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Демо режим: автоматтык түрдө демо колдонуучу катары кирет
      setUser(DEMO_USER);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      loadProfile(session?.user ?? null).finally(() => setLoading(false));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfile(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  const login = useCallback(async (email, password) => {
    setAuthError(null);
    if (!isSupabaseConfigured) {
      setUser(DEMO_USER);
      return { error: null };
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setAuthError(error.message);
      return { error };
    }
    return { error: null };
  }, []);

  const signup = useCallback(async (email, password, fullName, role) => {
    setAuthError(null);
    if (!isSupabaseConfigured) {
      setUser({ ...DEMO_USER, full_name: fullName, role });
      return { error: null };
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } },
    });
    setLoading(false);
    if (error) {
      setAuthError(error.message);
      return { error };
    }
    return { error: null };
  }, []);

  const logout = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, authError, login, signup, logout, isDemoMode: !isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
