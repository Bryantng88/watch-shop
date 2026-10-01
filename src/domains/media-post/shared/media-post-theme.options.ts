import type { CaseType, MovementType, WatchStyle } from "@prisma/client";

function enumOptions<T extends string>(labels: Record<T, string>) {
  return Object.entries(labels) as Array<[T, string]>;
}

export const MEDIA_POST_MOVEMENT_OPTIONS = enumOptions<MovementType>({
  AUTOMATIC: "Automatic",
  HAND_WOUND: "Manual winding",
  QUARTZ: "Quartz",
  SOLAR: "Solar",
  KINETIC: "Kinetic",
  MECHAQUARTZ: "Mechaquartz",
  SPRING_DRIVE: "Spring Drive",
  HYBRID: "Hybrid",
});

export const MEDIA_POST_CASE_SHAPE_OPTIONS = enumOptions<CaseType>({
  ROUND: "Tròn",
  TANK: "Chữ nhật / Tank",
  SQUARE: "Vuông",
  TONNEAU: "Tonneau",
  CUSHION: "Cushion",
  OVAL: "Oval",
  ASYMMETRICAL: "Bất đối xứng",
  OCTAGON: "Bát giác",
  POLYGON: "Đa giác",
  SPECIAL: "Đặc biệt",
  OTHER: "Khác",
});

export const MEDIA_POST_STYLE_OPTIONS = enumOptions<WatchStyle>({
  MILITARY: "Military",
  DRESS: "Dress",
  SPORT: "Sport",
  TOOL: "Tool",
  CASUAL: "Casual",
  CLASSIC: "Classic",
  MINIMALIST: "Minimalist",
  LUXURY: "Luxury",
  RETRO: "Retro",
  FUTURISTIC: "Futuristic",
});

export const MEDIA_POST_STOCK_OPTIONS = [
  ["IN_STOCK", "Còn hàng"],
  ["RESERVED", "Đã giữ"],
  ["OUT_OF_STOCK", "Hết hàng"],
] as const;

export const MEDIA_POST_AUDIENCE_OPTIONS = [
  ["MEN", "Men"],
  ["WOMEN", "Women"],
  ["UNISEX", "Unisex"],
] as const;

export const MEDIA_POST_SITE_CHANNEL_OPTIONS = [
  ["AFFORDABLE", "Affordable"],
  ["LUXURY", "Luxury"],
] as const;
