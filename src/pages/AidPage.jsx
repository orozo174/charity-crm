import { Icon, Icons } from "../components/Icon";
import { Btn, Card, Avatar } from "../components/UI";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import { formatMoney, formatMoneyShort } from "../utils/format";

export default function AidPage({ people }) {
  const allAid = people
    .flatMap((p) => (p.aid || []).map((a) => ({ ...a, person_name: p.name, person_id: p.id })))
    .sort((a, b) => new Date(b.aid_date) - new Date(a.aid_date));

  const total = allAid.reduce((s, a) => s + Number(a.amount), 0);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <Header
        title="Жардамдар"
        subtitle="Берилген жардамдардын тизмеси"
        actions={<Btn size="sm"><Icon d={Icons.plus} size={14} /> Жардам кош</Btn>}
      />
      <div className="p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Жардамдардын саны" value={allAid.length} color="blue" icon={<Icon d={Icons.aid} size={20} stroke="white" />} />
          <StatCard label="Жалпы сумма" value={formatMoneyShort(total)} color="emerald" icon={<Icon d={Icons.finance} size={20} stroke="white" />} />
          <StatCard label="Орточо жардам" value={formatMoneyShort(allAid.length ? total / allAid.length : 0)} color="purple" icon={<Icon d={Icons.trending} size={20} stroke="white" />} />
        </div>

        {/* Desktop table */}
        <Card className="hidden md:block overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Адам", "Жардам түрү", "Сумма", "Датасы", "Жооптуу"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allAid.map((a, i) => (
                  <tr key={a.id || i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Avatar name={a.person_name} size="sm" />
                        <span className="text-sm font-medium text-slate-900">{a.person_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{a.aid_type}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-bold text-emerald-600">{formatMoney(a.amount)}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-500 whitespace-nowrap">{a.aid_date}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{a.responsible_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {allAid.length === 0 && (
              <p className="text-center py-12 text-sm text-slate-400">Азырынча жардам катталган жок</p>
            )}
          </div>
        </Card>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {allAid.map((a, i) => (
            <Card key={a.id || i} className="p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar name={a.person_name} size="sm" />
                  <span className="text-sm font-medium text-slate-900 truncate">{a.person_name}</span>
                </div>
                <span className="text-sm font-bold text-emerald-600 flex-shrink-0">{formatMoney(a.amount)}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{a.aid_type}</span>
                <span className="text-xs text-slate-400">{a.aid_date} · {a.responsible_name}</span>
              </div>
            </Card>
          ))}
          {allAid.length === 0 && (
            <p className="text-center py-12 text-sm text-slate-400">Азырынча жардам катталган жок</p>
          )}
        </div>
      </div>
    </div>
  );
}
