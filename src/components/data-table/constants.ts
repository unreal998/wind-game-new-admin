import { Database } from "@/utils/supabase/database.types";

export const TRANSLATIONS_FILTER_LABELS = {
  text: {
    placeholder: "Введіть текст...",
  },
  number: {
    selectCondition: "Оберіть умову",
    placeholder: "Введіть число...",
    conditions: [
      { label: "Дорівнює", value: "is-equal-to" },
      { label: "Більше ніж", value: "is-greater-than" },
      { label: "Менше ніж", value: "is-less-than" },
      { label: "Між", value: "is-between" },
    ],
    and: "та",
  },
  date: {
    placeholder: "Виберіть дату",
  },
  dateRange: {
    placeholder: "Виберіть період",
  },
  select: {
    placeholder: "Оберіть значення",
  },
  common: {
    clearAll: "Скинути фільтри",
    noResults: "Нічого не знайдено",
  },
};

export const TRANSLATIONS_DATEPICKER = {
  cancel: "Скасувати",
  apply: "Застосувати",
  start: "Початок",
  end: "Кінець",
  range: "Діапазон",
};

export const USER_STATUSES = [
  { value: "active", label: "Активний" },
  { value: "banned", label: "Бан" },
] as const satisfies readonly {
  value: Database["public"]["Enums"]["user_status"];
  label: string;
}[];

export const TRANSACTION_STATUSES = [
  { value: "pending", label: "В обробці" },
  { value: "completed", label: "Виконано" },
  { value: "failed", label: "Помилка" },
  { value: "cancelled", label: "Скасовано" },
] as const satisfies readonly {
  value: Database["public"]["Enums"]["transaction_status"];
  label: string;
}[];

export const TRANSACTION_TYPES = [
  { value: "deposit", label: "Поповнення" },
  { value: "withdrawal", label: "Вивід" },
] as const satisfies readonly {
  value: Database["public"]["Enums"]["transaction_type"];
  label: string;
}[];

export const CHAT_TYPES = [
  { label: "Відправник", value: "sender" },
  { label: "Приватний", value: "private" },
  { label: "Група", value: "group" },
  { label: "Супергрупа", value: "supergroup" },
  { label: "Канал", value: "channel" },
] as const;

export const PLATFORMS = [
  { label: "Web", value: "weba" },
  { label: "Android", value: "android" },
  { label: "iOS", value: "ios" },
  { label: "Desktop", value: "tdesktop" },
] as const;

export const BOOLEAN_OPTIONS = [
  { label: "Так", value: "true" },
  { label: "Ні", value: "false" },
] as const;

export const LANGUAGE_TO_COUNTRY: { [key: string]: string } = {
  "uk": "ua", // Ukrainian -> Ukraine
  "en": "gb", // English -> United Kingdom
  "be": "by", // Belarusian -> Belarus
  "hy": "am", // Armenian -> Armenia
  "ka": "ge", // Georgian -> Georgia
  "el": "gr", // Greek -> Greece
  "fa": "ir", // Persian -> Iran
  "hi": "in", // Hindi -> India
  "he": "il", // Hebrew -> Israel
  "ja": "jp", // Japanese -> Japan
  "ko": "kr", // Korean -> South Korea
  "zh": "cn", // Chinese -> China
  "vi": "vn", // Vietnamese -> Vietnam
  "my": "mm", // Burmese -> Myanmar
} as const;
