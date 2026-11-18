import type { CaseType } from "@prisma/client";

export const WATCH_CASE_SHAPE_VALUES = [
  "ROUND",
  "TANK",
  "SQUARE",
  "SPECIAL",
  "OTHER",
  "TONNEAU",
  "CUSHION",
  "OVAL",
  "ASYMMETRICAL",
  "OCTAGON",
  "POLYGON",
  "RECTANGULAR",
  "TV",
] as const;

export const WATCH_CASE_SHAPE_LABELS: Record<CaseType, string> = {
  ROUND: "Round (Tròn)",
  TANK: "Tank",
  SQUARE: "Square (Vuông)",
  SPECIAL: "Special (Đặc biệt)",
  OTHER: "Other (Khác)",
  TONNEAU: "Tonneau (Dáng thùng)",
  CUSHION: "Cushion (Dáng gối)",
  OVAL: "Oval (Bầu dục)",
  ASYMMETRICAL: "Asymmetrical (Bất đối xứng)",
  OCTAGON: "Octagonal (Bát giác)",
  POLYGON: "Polygonal (Đa giác)",
  RECTANGULAR: "Rectangular (Chữ nhật)",
  TV: "TV-shaped (Dáng TV)",
};

export const WATCH_CASE_SHAPE_OPTIONS = WATCH_CASE_SHAPE_VALUES.map(
  (value) => ({ value, label: WATCH_CASE_SHAPE_LABELS[value] }),
);
