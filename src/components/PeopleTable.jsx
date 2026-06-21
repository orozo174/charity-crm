import { Icon, Icons } from "./Icon";
import { Avatar, Badge, Card } from "./UI";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "../utils/constants";

export default function PeopleTable({ people, onSelect }) {
  if (people.length === 0) {
    return (
      <Card>
        <div className="text-center py-16 text-slate-400">
          <Icon d={Icons.search} size={32} stroke="#cbd5e1" />
          <p className="mt-2 text-sm">Эч нерсе табылган жок</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* Desktop / tablet: full table, scrolls horizontally on tablet if needed */}
      <Card className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["Аты-жөнү", "Категория", "Дареги", "Балдар", "Волонтер", "Приоритет", "Статус", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {people.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onSelect(p)}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={p.name} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.age} жаш</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{p.category}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 max-w-[200px] truncate">{p.address}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-700 font-medium">{p.children}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{p.volunteer_name}</td>
                  <td className="px-5 py-3.5"><Badge config={PRIORITY_CONFIG[p.priority]} /></td>
                  <td className="px-5 py-3.5"><Badge config={STATUS_CONFIG[p.status]} /></td>
                  <td className="px-5 py-3.5">
                    <Icon d={Icons.chevronRight} size={16} stroke="#94a3b8" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
          {people.length} адам көрсөтүлүүдө
        </div>
      </Card>

      {/* Mobile: stacked cards instead of a cramped table */}
      <div className="md:hidden space-y-3">
        {people.map((p) => (
          <Card key={p.id} className="p-4 active:bg-slate-50" onClick={() => onSelect(p)}>
            <button onClick={() => onSelect(p)} className="w-full text-left">
              <div className="flex items-start gap-3">
                <Avatar name={p.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">{p.name}</p>
                    <Icon d={Icons.chevronRight} size={16} stroke="#94a3b8" className="flex-shrink-0" />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{p.age} жаш · {p.category}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{p.address}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge config={PRIORITY_CONFIG[p.priority]} />
                    <Badge config={STATUS_CONFIG[p.status]} />
                    <span className="text-xs text-slate-400">· {p.children} бала</span>
                  </div>
                </div>
              </div>
            </button>
          </Card>
        ))}
        <p className="text-center text-xs text-slate-400 py-2">{people.length} адам көрсөтүлүүдө</p>
      </div>
    </>
  );
}
