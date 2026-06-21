import { Card } from "./UI";

const COLORS = {
  blue: "from-blue-500 to-blue-600",
  emerald: "from-emerald-500 to-emerald-600",
  amber: "from-amber-400 to-amber-500",
  purple: "from-purple-500 to-purple-600",
};

export default function StatCard({ label, value, sub, color = "blue", icon }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm text-slate-500 font-medium truncate">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 truncate">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1 truncate">{sub}</p>}
        </div>
        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${COLORS[color]} flex items-center justify-center text-white flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
