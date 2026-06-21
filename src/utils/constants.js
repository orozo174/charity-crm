// Статус жана приоритет конфигурациялары — баардык барактарда колдонулат.

export const STATUS_CONFIG = {
  pending: { label: "Күтүүдө", color: "bg-amber-100 text-amber-700" },
  in_progress: { label: "Иштелүүдө", color: "bg-blue-100 text-blue-700" },
  helped: { label: "Жардам берилди", color: "bg-emerald-100 text-emerald-700" },
};

export const PRIORITY_CONFIG = {
  high: { label: "Жогорку", color: "bg-red-100 text-red-600" },
  medium: { label: "Орточо", color: "bg-amber-100 text-amber-600" },
  low: { label: "Төмөн", color: "bg-slate-100 text-slate-500" },
};

export const ROLE_LABELS = {
  admin: "Администратор",
  coordinator: "Координатор",
  volunteer: "Волонтер",
};

export const CATEGORIES = [
  "Жалгыз ата-эне",
  "Көп балалуу үй-бүлө",
  "Карыя",
  "Майып",
  "Жетим бала",
  "Башка",
];

export const REGIONS = [
  "Бишкек",
  "Ош",
  "Жалал-Абад",
  "Баткен",
  "Нарын",
  "Талас",
  "Ысык-Көл",
  "Чүй",
];

export const AID_TYPES = [
  "Азык-түлүк",
  "Кийим",
  "Дары-дармек",
  "Мектеп буюмдары",
  "Акчалай жардам",
  "Башка",
];

// Кыргызча ай аталыштары — туура жазылыштары менен (мурунку "Қан" катасы оңдолду)
export const MONTHS_KY = [
  "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
  "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек",
];

export const MONTHS_KY_FULL = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
