import { initials } from "../utils/format";

export const Badge = ({ config }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${config.color}`}>
    {config.label}
  </span>
);

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}>{children}</div>
);

export const Btn = ({ children, variant = "primary", size = "md", onClick, className = "", disabled, type = "button" }) => {
  const base = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 active:scale-95";
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3 text-base" };
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]} ${className} disabled:opacity-50 disabled:active:scale-100`}>
      {children}
    </button>
  );
};

export const Avatar = ({ name, size = "md" }) => {
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base" };
  return (
    <div className={`${sizes[size]} rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold flex items-center justify-center flex-shrink-0`}>
      {initials(name)}
    </div>
  );
};

export const Spinner = ({ size = 20, className = "" }) => (
  <svg
    className={`animate-spin ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
  >
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

export const ErrorBanner = ({ message }) => {
  if (!message) return null;
  return (
    <div className="px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
      {message}
    </div>
  );
};
