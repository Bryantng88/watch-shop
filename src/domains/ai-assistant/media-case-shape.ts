import { WATCH_CASE_SHAPE_VALUES, WATCH_CASE_SHAPE_LABELS } from "@/domains/watch/shared/watch-case-shape.options";
import { z } from "zod";

export const mediaCaseShapeSchema = z.enum(WATCH_CASE_SHAPE_VALUES);
export type MediaCaseShape = z.infer<typeof mediaCaseShapeSchema>;
export const mediaCaseShapeLabels: Record<MediaCaseShape, string> = WATCH_CASE_SHAPE_LABELS;
const aliases: Record<string, MediaCaseShape> = {
  tron: "ROUND", round: "ROUND", vuong: "SQUARE", square: "SQUARE",
  "chu nhat": "RECTANGULAR", tank: "TANK", rectangular: "RECTANGULAR", rectangle: "RECTANGULAR",
  tv: "TV", television: "TV", tivi: "TV", "chu nhat ngang": "TV",
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
