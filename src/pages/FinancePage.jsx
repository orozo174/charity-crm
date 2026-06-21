import { Icon, Icons } from "../components/Icon";
import { Btn, Card } from "../components/UI";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import { formatMoney, formatMoneyShort } from "../utils/format";

const MONTHLY_BUDGET = 500000;

export default function FinancePage({ people }) {
  const totalAid = people.flatMap((p) => p.aid || []).reduce((s, a) => s + Number(a.amount), 0);
  const remaining = MONTHLY_BUDGET - totalAid;
  const pct = MONTHLY_BUDGET > 0 ? Math.min(100, Math.round((totalAid / MONTHLY_BUDGET) * 100)) : 0;

  const byType = {};
  people.flatMap((p) => p.aid || []).forEach((a) => {
    byType[a.aid_type] = (byType[a.aid_type] || 0) + Number(a.amount);
  });

  const recentTransactions = people
    .flatMap((p) => (p.aid || []).map((a) => ({ ...a, person: p.name })))
    .sort((a, b) => new Date(b.aid_date) - new Date(a.aid_date))
    .slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <Header
        title="Каржы"
        subtitle="Бюджет жана чыгымдар"
        actions={<Btn size="sm"><Icon d={Icons.download} size={14} /> Экспорт</Btn>}
      />
      <div className="p-4 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Жалпы бюджет" value={formatMoneyShort(MONTHLY_BUDGET)} color="blue" icon={<Icon d={Icons.finance} size={20} stroke="white" />} />
          <StatCard label="Жумшалган" value={formatMoneyShort(totalAid)} color="amber" icon={<Icon d={Icons.arrowUp} size={20} stroke="white" />} />
          <StatCard label="Калдык" value={formatMoneyShort(remaining)} color="emerald" icon={<Icon d={Icons.trending} size={20} stroke="white" />} />
        </div>

        <Card className="p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Бюджеттин колдонулушу</h3>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-sm font-bold text-slate-900 w-10 text-right">{pct}%</span>
          </div>
          <p className="text-xs text-slate-400">{formatMoney(totalAid)} / {formatMoney(MONTHLY_BUDGET)}</p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Жардам түрлөрү боюнча</h3>
            <div className="space-y-3">
              {Object.entries(byType).map(([type, amount]) => (
                <div key={type} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1 gap-2">
                      <span className="text-xs font-medium text-slate-700 truncate">{type}</span>
                      <span className="text-xs font-bold text-slate-900 flex-shrink-0">{formatMoney(amount)}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full">
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${totalAid ? (amount / totalAid) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              ))}
              {Object.keys(byType).length === 0 && (
                <p className="text-sm text-slate-400 text-center py-6">Маалымат жок</p>
              )}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Акыркы транзакциялар</h3>
            <div className="space-y-2">
              {recentTransactions.map((a, i) => (
                <div key={a.id || i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-900 truncate">{a.person}</p>
                    <p className="text-xs text-slate-400">{a.aid_type} · {a.aid_date}</p>
                  </div>
                  <span className="text-sm font-bold text-red-500 flex-shrink-0">-{formatMoney(a.amount)}</span>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-6">Транзакция жок</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
