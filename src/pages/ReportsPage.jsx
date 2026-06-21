import { Icon, Icons } from "../components/Icon";
import { Btn, Card, Avatar } from "../components/UI";
import Header from "../components/Header";

export default function ReportsPage({ people }) {
  const reports = people
    .filter((p) => p.comments)
    .map((p) => ({
      id: p.id,
      person: p.name,
      volunteer: p.volunteer_name,
      date: p.created_at?.split?.("T")?.[0] || p.created_at,
      comment: p.comments,
      hasPhotos: (p.photos || []).length > 0,
    }));

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <Header
        title="Отчеттор"
        subtitle="Волонтерлордун отчеттору"
        actions={<Btn size="sm"><Icon d={Icons.plus} size={14} /> Отчет кош</Btn>}
      />
      <div className="p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reports.map((r) => (
            <Card key={r.id} className="p-5">
              <div className="flex items-start justify-between mb-3 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar name={r.volunteer} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{r.volunteer}</p>
                    <p className="text-xs text-slate-400">{r.date}</p>
                  </div>
                </div>
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full flex-shrink-0">Отчет</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Адам: {r.person}</p>
              <p className="text-sm text-slate-700 leading-relaxed">{r.comment}</p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                <Btn variant="ghost" size="sm"><Icon d={Icons.camera} size={13} /> Сүрөттөр</Btn>
                <Btn variant="ghost" size="sm"><Icon d={Icons.video} size={13} /> Видео</Btn>
              </div>
            </Card>
          ))}
          {reports.length === 0 && (
            <p className="text-center py-12 text-sm text-slate-400 sm:col-span-2">Азырынча отчет жок</p>
          )}
        </div>
      </div>
    </div>
  );
}
