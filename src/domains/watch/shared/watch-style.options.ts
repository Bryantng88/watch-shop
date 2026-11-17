import type { WatchStyle } from "@prisma/client";

export const WATCH_STYLE_VALUES = [
  "MILITARY",
  "DRESS",
  "SPORT",
  "TOOL",
  "CASUAL",
  "CLASSIC",
  "MINIMALIST",
  "LUXURY",
  "RETRO",
  "FUTURISTIC",
  "DIVER",
  "PILOT",
  "RACING",
] as const;

export const WATCH_STYLE_LABELS: Record<
  WatchStyle,
  { vi: string; en: string }
> = {
  MILITARY: { vi: "Quân đội", en: "Military" },
  DRESS: { vi: "Thanh lịch", en: "Dress" },
  SPORT: { vi: "Thể thao", en: "Sport" },
  TOOL: { vi: "Công cụ", en: "Tool" },
  CASUAL: { vi: "Thường ngày", en: "Casual" },
  CLASSIC: { vi: "Cổ điển", en: "Classic" },
  MINIMALIST: { vi: "Tối giản", en: "Minimalist" },
  LUXURY: { vi: "Sang trọng", en: "Luxury" },
  RETRO: { vi: "Hoài cổ", en: "Retro" },
  FUTURISTIC: { vi: "Vị lai", en: "Futuristic" },
  DIVER: { vi: "Lặn (Diver)", en: "Diver" },
  PILOT: { vi: "Phi công (Pilot)", en: "Pilot" },
  RACING: { vi: "Đua xe (Racing)", en: "Racing" },
};

export const WATCH_STYLE_OPTIONS = WATCH_STYLE_VALUES.map((value) => ({
  value,
  label: WATCH_STYLE_LABELS[value].vi,
}));
export const WATCH_STYLE_EN_LABELS = Object.fromEntries(
  WATCH_STYLE_VALUES.map((value) => [value, WATCH_STYLE_LABELS[value].en]),
) as Record<WatchStyle, string>;
