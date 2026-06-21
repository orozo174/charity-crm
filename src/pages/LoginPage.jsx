import { useState } from "react";
import { Icon, Icons } from "../components/Icon";
import { Btn, Card, Spinner, ErrorBanner } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { ROLE_LABELS } from "../utils/constants";

export default function LoginPage() {
  const { login, signup, authError, isDemoMode } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("volunteer");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const inputCls = "w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Email жана сырсөздү толтуруңуз");
      return;
    }
    if (mode === "signup" && !fullName) {
      setLocalError("Атыңызды жазыңыз");
      return;
    }

    setSubmitting(true);
    const result = mode === "login"
      ? await login(email, password)
      : await signup(email, password, fullName, role);
    setSubmitting(false);

    if (result.error) {
      setLocalError(result.error.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm mb-3">
            <Icon d={Icons.heart} size={26} stroke="white" />
          </div>
          <h1 className="text-lg font-bold text-slate-900">КыргызЖардам</h1>
          <p className="text-xs text-slate-400">Кайрымдуулук фондунун ички системасы</p>
        </div>

        {isDemoMode && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
            Демо режим: Supabase орнотулган жок. Каалаган email/сырсөз менен кирсеңиз болот.
          </div>
        )}

        <Card className="p-6">
          {/* Mode tabs */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-5">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
            >
              Кирүү
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
            >
              Катталуу
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className={labelCls}>Аты-жөнүңүз</label>
                <input className={inputCls} placeholder="Айгүл Токтосунова" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
            )}

            <div>
              <label className={labelCls}>Email</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon d={Icons.mail} size={15} stroke="#94a3b8" />
                </div>
                <input className={`${inputCls} pl-9`} type="email" placeholder="aty@charity.kg" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Сырсөз</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Icon d={Icons.lock} size={15} stroke="#94a3b8" />
                </div>
                <input className={`${inputCls} pl-9`} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className={labelCls}>Ролуңуз</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(ROLE_LABELS).map(([key, label]) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setRole(key)}
                      className={`py-2 text-xs font-medium rounded-xl border-2 transition-colors ${role === key ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <ErrorBanner message={localError || authError} />

            <Btn type="submit" className="w-full justify-center mt-2" disabled={submitting}>
              {submitting ? <Spinner size={16} /> : mode === "login" ? "Кирүү" : "Каттоо"}
            </Btn>
          </form>
        </Card>

        <p className="text-center text-xs text-slate-400 mt-5">
          Бул ички система — фонддун кызматкерлери жана волонтерлору үчүн гана.
        </p>
      </div>
    </div>
  );
}
