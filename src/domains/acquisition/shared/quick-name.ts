import { z } from "zod";
import { formatWatchTitle } from "@/domains/watch/shared/watch-title-format";
const fact = z.string().trim().min(1).max(120).nullable();
export const quickNameResultSchema = z.object({
  brandName: fact, model: fact, referenceNumber: fact, nickname: fact,
  movementType: z.enum(["AUTOMATIC", "HAND_WOUND", "QUARTZ", "SOLAR", "KINETIC", "MECHAQUARTZ", "SPRING_DRIVE", "HYBRID"]).nullable(),
  notes: z.array(z.string().trim().min(1).max(240)).max(6),
}).strict();
export type QuickNameResult = z.infer<typeof quickNameResultSchema>;
export function quickNameTitle(result: QuickNameResult) {
  return result.brandName || result.model ? formatWatchTitle(result) : "";
}
export const quickNameLineSchema = z.object({
  id: z.string().min(1).max(100), imageKey: z.string().min(1).max(500),
  audienceSegment: z.enum(["MEN", "WOMEN"]), quickInput: z.string().max(500), aiHint: z.string().max(1000),
}).strict();
export type QuickNameLine = z.infer<typeof quickNameLineSchema>;
export const quickNameRequestSchema = z.object({requestKey: z.string().uuid(), lines: z.array(quickNameLineSchema).min(1).max(12)}).strict()
  .refine(value => new Set(value.lines.map(line => line.id)).size === value.lines.length, "Dòng bị trùng.");
export function quickNameSource(line: Pick<QuickNameLine, "imageKey" | "audienceSegment" | "quickInput" | "aiHint">) {
  return JSON.stringify([line.imageKey, line.audienceSegment, line.quickInput, line.aiHint]);
}
export function isQuickNameImageKey(key: string, segment: "MEN" | "WOMEN") {
  return key.startsWith(`media/${segment.toLowerCase()}/inline/`) && !/[\\%\u0000-\u001f]/.test(key)
    && !key.split("/").some(part => !part || part === "." || part === "..")
    && /\.(jpg|jpeg|png|webp)$/i.test(key);
}
export function applyQuickName<T extends { id: string; imageKey: string | null; audienceSegment: "MEN" | "WOMEN"; quickInput: string; aiHint: string; tradeInSource: string }>(line: T, source: QuickNameLine, title: string | null): T {
  if(line.id!==source.id || line.tradeInSource!=="EXTERNAL" || quickNameSource({...line,imageKey:line.imageKey||""})!==quickNameSource(source) || !title?.trim())return line;
  return {...line,quickInput:title};
}
