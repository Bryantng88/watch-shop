import { z } from "zod";
export const reviewKinds = [
  "personal-work",
  "personal-update",
  "order",
  "order-services",
  "business",
  "media-post",
  "permission-support",
  "code",
] as const;
export const reviewBindingSchema = z
  .object({
    kind: z.enum(reviewKinds),
    revision: z.number().int().positive(),
    token: z.string().regex(/^[a-f0-9]{64}$/),
  })
  .strict();
export type ReviewBinding = z.infer<typeof reviewBindingSchema>;
export type PendingReview = ReviewBinding & {
  operations: number;
  label: string;
};
const confirmations = new Set([
  "duyet",
  "duyet nhe",
  "duyet ban",
  "duyet het",
  "duyet tat ca",
  "dong y",
  "dong y nhe",
  "xac nhan",
  "xac nhan duyet",
  "ok",
  "okay",
  "oke",
  "ok ban",
  "ok nhe",
  "ok duyet",
  "ok duyet het",
  "approve",
  "confirm",
  "go ahead",
]);
/** Explicit whole-message review commands, never a business intent keyword gate. */
export function reviewConfirmation(
  text: string,
): { count: number | null } | null {
  const value = text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .trim()
    .replace(/[.!]+$/g, "")
    .trim()
    .replace(/\s+/g, " ");
  if (confirmations.has(value)) return { count: null };
  const match = /^duyet ([1-9]\d?) (?:thay doi|viec|muc)$/.exec(value);
  return match ? { count: Number(match[1]) } : null;
}
