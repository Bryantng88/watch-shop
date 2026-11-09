import { z } from "zod";
const time = z.string().datetime({ offset: true });
export const personalWorkPlanSchema = z
  .object({
    kind: z.enum(["TASK", "EVENT"]),
    title: z.string().trim().min(1).max(300),
    note: z.string().trim().max(4000).nullable(),
    categoryKey: z.string().min(1).max(100),
    workType: z.string().max(100).nullable(),
    dueAt: time.nullable(),
    scheduledEndAt: time.nullable(),
    tags: z
      .array(
        z
          .string()
          .trim()
          .min(1)
          .max(80)
          .refine((t) => t.toLowerCase() !== "codex", "Không tự gửi công việc cho Codex."),
      )
      .max(20),
    shares: z
      .array(
        z
          .object({ userId: z.string().min(1).max(100), accessLevel: z.enum(["VIEWER", "EDITOR"]) })
          .strict(),
      )
      .max(20),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
    checklist: z.array(z.string().trim().min(1).max(500)).max(12),
    syncGoogle: z.boolean(),
  })
  .strict()
  .superRefine((p, c) => {
    if (p.kind === "EVENT" && p.checklist.length)
      c.addIssue({ code: "custom", message: "Sự kiện không có đầu việc cần hoàn thành" });
    if (p.kind === "EVENT" && !p.dueAt)
      c.addIssue({ code: "custom", message: "Sự kiện cần thời điểm diễn ra" });
    if (p.scheduledEndAt && (!p.dueAt || Date.parse(p.scheduledEndAt) <= Date.parse(p.dueAt)))
      c.addIssue({ code: "custom", message: "Giờ kết thúc phải sau giờ bắt đầu" });
    if (new Set(p.shares.map((s) => s.userId)).size !== p.shares.length)
      c.addIssue({ code: "custom", message: "Người chia sẻ bị trùng" });
  });
export type PersonalWorkPlan = z.infer<typeof personalWorkPlanSchema>;
export type PersonalWorkDraft = {
  requiredPermissions?: string[];
  requiredTaskIds?: string[];
  plan: PersonalWorkPlan;
  revision: number;
  categoryLabel: string;
  shares: { id: string; name: string | null; accessLevel: "VIEWER" | "EDITOR" }[];
};
export type CreatedPersonalWork = {
  revision: number;
  id: string;
  title: string;
  kind: "TASK" | "EVENT";
  calendar: "NONE" | "PENDING" | "SYNCED" | "FAILED";
};
