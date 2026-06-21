import { Icon, Icons } from "./Icon";
import { Avatar } from "./UI";
import { useAuth } from "../context/AuthContext";
import { ROLE_LABELS } from "../utils/constants";

const ALL_NAV_ITEMS = [
  { id: "dashboard", label: "Башкы бет", icon: Icons.dashboard, roles: ["admin", "coordinator", "volunteer"] },
  { id: "people", label: "Муктаж адамдар", icon: Icons.people, roles: ["admin", "coordinator", "volunteer"] },
  { id: "aid", label: "Жардамдар", icon: Icons.aid, roles: ["admin", "coordinator", "volunteer"] },
  { id: "reports", label: "Отчеттор", icon: Icons.reports, roles: ["admin", "coordinator", "volunteer"] },
  { id: "volunteers", label: "Волонтерлор", icon: Icons.volunteers, roles: ["admin", "coordinator"] },
  { id: "finance", label: "Каржы", icon: Icons.finance, roles: ["admin"] },
];

export default function Sidebar({ page, setPage, collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navItems = ALL_NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  return (
    <aside className={`${collapsed ? "w-16" : "w-60"} flex-shrink-0 bg-white border-r border-slate-100 flex flex-col h-full transition-all duration-200`}>
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-slate-100 gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
          <Icon d={Icons.heart} size={16} stroke="white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 leading-tight">КыргызЖардам</p>
            <p className="text-xs text-slate-400">Кайрымдуулук фонду</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <Icon d={item.icon} size={18} stroke={active ? "#1d4ed8" : "currentColor"} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <Avatar name={user?.full_name} size="sm" />
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-slate-900 truncate">{user?.full_name}</p>
              <p className="text-xs text-slate-400">{ROLE_LABELS[user?.role] || "—"}</p>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className="w-full mt-0.5 flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <Icon d={Icons.logout} size={16} />
          {!collapsed && "Чыгуу"}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full mt-1 flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
        >
          <Icon d={collapsed ? Icons.chevronRight : Icons.chevronLeft} size={16} />
          {!collapsed && "Кичирейт"}
        </button>
      </div>
    </aside>
  );
}
