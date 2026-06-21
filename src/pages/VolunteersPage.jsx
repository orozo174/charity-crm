import { Icon, Icons } from "../components/Icon";
import { Btn, Card } from "../components/UI";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import { ROLE_LABELS } from "../utils/constants";

export default function VolunteersPage({ volunteers }) {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <Header
        title="Волонтерлор"
        subtitle={`${volunteers.length} адам`}
        actions={<Btn size="sm"><Icon d={Icons.plus} size={14} /> Волонтер кош</Btn>}
      />
      <div className="p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Жалпы волонтер" value={volunteers.length} color="blue" icon={<Icon d={Icons.people} size={20} stroke="white" />} />
          <StatCard label="Активдүү" value={volunteers.filter((v) => v.active).length} color="emerald" icon={<Icon d={Icons.check} size={20} stroke="white" />} />
          <StatCard label="Координатор" value={volunteers.filter((v) => v.role === "coordinator").length} color="purple" icon={<Icon d={Icons.star} size={20} stroke="white" />} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {volunteers.map((v) => (
            <Card key={v.id} className="p-5">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${v.role === "coordinator" ? "bg-gradient-to-br from-purple-500 to-purple-600" : "bg-gradient-to-br from-blue-500 to-blue-600"}`}>
                  {v.avatar_letter}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{v.full_name}</h3>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${v.active ? "bg-emerald-500" : "bg-slate-300"}`} />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {ROLE_LABELS[v.role]} · {v.region}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <Icon d={Icons.phone} size={11} stroke="#94a3b8" />
                    {v.phone}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
                {[
                  { label: "Кошулган адам", value: v.addedPeople },
                  { label: "Аяктаган жардам", value: v.completedAid },
                  { label: "Мүчө болгон", value: (v.created_at || "").slice(0, 7) },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <p className="text-base font-bold text-slate-900">{item.value}</p>
                    <p className="text-xs text-slate-400 leading-tight">{item.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
