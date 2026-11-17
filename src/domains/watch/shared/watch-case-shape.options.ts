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
  ROUND: "Tròn",
  TANK: "Tank",
  SQUARE: "Vuông",
  SPECIAL: "Đặc biệt",
  OTHER: "Khác",
  TONNEAU: "Dáng thùng (Tonneau)",
  CUSHION: "Dáng gối (Cushion)",
  OVAL: "Bầu dục (Oval)",
  ASYMMETRICAL: "Bất đối xứng",
  OCTAGON: "Bát giác",
  POLYGON: "Đa giác",
  RECTANGULAR: "Chữ nhật",
  TV: "Dáng TV",
};

export const WATCH_CASE_SHAPE_OPTIONS = WATCH_CASE_SHAPE_VALUES.map(
  (value) => ({ value, label: WATCH_CASE_SHAPE_LABELS[value] }),
);
