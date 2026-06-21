import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

export async function createAidRecord({ personId, aidType, amount, responsibleId, notes }) {
  if (!isSupabaseConfigured) {
    return {
      data: {
        id: `demo-aid-${Date.now()}`,
        person_id: personId,
        aid_type: aidType,
        amount,
        aid_date: new Date().toISOString().split("T")[0],
        responsible_name: "Сиз",
      },
      error: null,
    };
  }

  const { data, error } = await supabase
    .from("aid")
    .insert([
      {
        person_id: personId,
        aid_type: aidType,
        amount,
        responsible_id: responsibleId,
        notes,
        aid_date: new Date().toISOString().split("T")[0],
      },
    ])
    .select()
    .single();

  return { data, error };
}

export async function fetchAllAid() {
  if (!isSupabaseConfigured) {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from("aid")
    .select(`
      *,
      person:person_id ( id, name ),
      responsible:responsible_id ( full_name )
    `)
    .order("aid_date", { ascending: false });

  if (error) return { data: null, error };

  const normalized = data.map((a) => ({
    ...a,
    person_name: a.person?.name || "—",
    responsible_name: a.responsible?.full_name || "—",
  }));

  return { data: normalized, error: null };
}
