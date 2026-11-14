import { z } from "zod";

export const mediaCaseShapeSchema = z.enum([
  "ROUND", "TANK", "SQUARE", "SPECIAL", "OTHER", "TONNEAU", "CUSHION",
  "OVAL", "ASYMMETRICAL", "OCTAGON", "POLYGON",
]);
export type MediaCaseShape = z.infer<typeof mediaCaseShapeSchema>;
export const mediaCaseShapeLabels: Record<MediaCaseShape, string> = {
  ROUND: "Tròn", TANK: "Chữ nhật / Tank", SQUARE: "Vuông", SPECIAL: "Đặc biệt",
  OTHER: "Khác", TONNEAU: "Tonneau / Thùng", CUSHION: "Cushion / Gối",
  OVAL: "Oval / Bầu dục", ASYMMETRICAL: "Bất đối xứng", OCTAGON: "Bát giác",
  POLYGON: "Đa giác",
};
const aliases: Record<string, MediaCaseShape> = {
  tron: "ROUND", round: "ROUND", vuong: "SQUARE", square: "SQUARE",
  "chu nhat": "TANK", tank: "TANK", rectangular: "TANK", rectangle: "TANK",
  oval: "OVAL", "bau duc": "OVAL", tonneau: "TONNEAU", thung: "TONNEAU",
  cushion: "CUSHION", goi: "CUSHION", "bat giac": "OCTAGON", octagon: "OCTAGON",
  octagonal: "OCTAGON", "da giac": "POLYGON", polygon: "POLYGON",
  "bat doi xung": "ASYMMETRICAL", asymmetrical: "ASYMMETRICAL",
};
/** Only whole shape terms are normalized; model names and other keywords stay literal. */
export function mediaShapeKeyword(term: string): MediaCaseShape | undefined {
  const normalized = term.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/đ/g, "d").trim().replace(/\s+/g, " ")
    .replace(/^(?:(?:form|dang|mat|vo|case|shape) )+/, "");
  return aliases[normalized];
}
