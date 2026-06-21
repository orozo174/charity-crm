export default function Header({ title, subtitle, actions }) {
  return (
    <div className="min-h-16 bg-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center px-4 sm:px-6 py-3 sm:py-0 gap-3 flex-shrink-0">
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-slate-900 truncate">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 truncate">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}
