export const formatMoney = (amount) =>
  `${Number(amount || 0).toLocaleString("ru-RU")} сом`;

export const formatMoneyShort = (amount) => {
  const n = Number(amount || 0);
  if (n >= 1000) return `${(n / 1000).toFixed(1)}к сом`;
  return `${n} сом`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export const initials = (name = "") => name.trim()[0]?.toUpperCase() || "?";

export const todayISO = () => new Date().toISOString().split("T")[0];
