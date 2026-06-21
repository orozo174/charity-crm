import { Icon, Icons } from "../components/Icon";
import { Btn, Card, Avatar, Badge } from "../components/UI";
import StatCard from "../components/StatCard";
import Header from "../components/Header";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "../utils/constants";
import { formatMoneyShort } from "../utils/format";

export default function Dashboard({ people, volunteers, setPage, onSelectPerson }) {
  const total = people.length;
  const helped = people.filter((p) => p.status === "helped").length;
  const pending = people.filter((p) => p.status === "pending").length;
  const totalAid = people.flatMap((p) => p.aid || []).reduce((s, a) => s + Number(a.amount), 0);

  const recent = [...people]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const activeVolunteers = volunteers.filter((v) => v.active);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <Header
        title="Башкы бет"
        subtitle="КыргызЖардам Кайрымдуулук Фондунун иш панели"
        actions={
          <Btn onClick={() => setPage("people_add")} size="sm">
            <Icon d={Icons.plus} size={14} /> Адам кош
          </Btn>
        }
      />

      <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard label="Жалпы муктаж адамдар" value={total} sub="Бардык убакытта" color="blue" icon={<Icon d={Icons.people} size={20} stroke="white" />} />
          <StatCard label="Жардам берилди" value={helped} sub={total ? `${Math.round((helped / total) * 100)}% аяктады` : "—"} color="emerald" icon={<Icon d={Icons.check} size={20} stroke="white" />} />
          <StatCard label="Күтүүдө" value={pending} sub="Кезеги бар" color="amber" icon={<Icon d={Icons.clock} size={20} stroke="white" />} />
          <StatCard label="Берилген жардам" value={formatMoneyShort(totalAid)} sub="Жалпы сумма" color="purple" icon={<Icon d={Icons.finance} size={20} stroke="white" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent people */}
          <Card className="lg:col-span-2">
            <div className="p-5 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Акыркы кошулган адамдар</h2>
              <Btn variant="ghost" size="sm" onClick={() => setPage("people")}>Баарын көр</Btn>
            </div>
            <div className="divide-y divide-slate-50">
              {recent.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-slate-400">Азырынча адам кошулган жок</p>
              )}
              {recent.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPerson(p)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left"
                >
                  <Avatar name={p.name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{p.name}</p>
                    <p className="text-xs text-slate-400 truncate">{p.category} · {p.address?.split(",")[0]}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <Badge config={PRIORITY_CONFIG[p.priority]} />
                    <Badge config={STATUS_CONFIG[p.status]} />
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Volunteer activity */}
          <Card>
            <div className="p-5 border-b border-slate-50">
              <h2 className="text-sm font-bold text-slate-900">Активдүү волонтерлор</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {activeVolunteers.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-slate-400">Активдүү волонтер жок</p>
              )}
              {activeVolunteers.map((v) => (
                <div key={v.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${v.role === "coordinator" ? "bg-gradient-to-br from-purple-500 to-purple-600" : "bg-gradient-to-br from-blue-500 to-blue-600"}`}>
                    {v.avatar_letter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{v.full_name}</p>
                    <p className="text-xs text-slate-400">{v.region}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-slate-900">{v.addedPeople}</p>
                    <p className="text-xs text-slate-400">адам</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Жаңы адам кош", icon: Icons.plus, page: "people_add", color: "bg-blue-600 text-white" },
            { label: "Жардам бекит", icon: Icons.check, page: "aid", color: "bg-emerald-600 text-white" },
            { label: "Отчет жаз", icon: Icons.reports, page: "reports", color: "bg-purple-600 text-white" },
            { label: "Каржы", icon: Icons.finance, page: "finance", color: "bg-amber-500 text-white" },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => setPage(a.page)}
              className={`${a.color} rounded-2xl p-4 text-left shadow-sm hover:opacity-90 transition-opacity active:scale-95`}
            >
              <Icon d={a.icon} size={22} stroke="white" />
              <p className="text-sm font-semibold mt-3">{a.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
