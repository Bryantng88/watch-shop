import { createHash } from "node:crypto";
import type { Prisma } from "@prisma/client";

export function codexReadyWhere(now: Date): Prisma.PersonalCodexRunWhereInput {
  return {
    status: "QUEUED",
    OR: [{ notBefore: null }, { notBefore: { lte: now } }],
  };
}
export function personalCodexPrompt(item: {
  title: string;
  note: string | null;
  checklists: { title: string; isDone: boolean }[];
}) {
  return [
    item.title,
    item.note ?? "",
    ...item.checklists.map((c) => `${c.isDone ? "[x]" : "[ ]"} ${c.title}`),
  ].join("\n");
}
export function personalCodexFingerprint(prompt: string) {
  return createHash("sha256").update(prompt).digest("hex");
}
