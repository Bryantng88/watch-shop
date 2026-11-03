import { z } from "zod";

export const MAX_LOOKUPS = 16;
export const MAX_LEADS = 3;
export const routingSchema = z.object({ SALES: z.string().min(1).max(100), TECHNICAL: z.string().min(1).max(100).nullable(), OPERATION: z.string().min(1).max(100).nullable() }).strict();
export const requestIntakeSchema = z.object({ requestKey: z.string().uuid(), text: z.string().trim().min(10).max(6000), routing: routingSchema }).strict();
const noControl = (value: string) => !/(?:workTypeKey|workspaceKind|workspaceDefinition\w*|blueprint\w*|coreFlow\w*|sharedUserIds|systemShareGroupKey|operationWorkspaceRole|flowStage\w*|paymentWorkspaceRole|serviceOperationRole)\s*:/i.test(value);
const note = z.string().max(1500).refine(noControl, "Nội dung không được chứa chỉ thị hệ thống");
export const lookupRequestSchema = z.discriminatedUnion("tool", [
  z.object({ tool: z.literal("customers.search"), query: z.string().trim().min(3).max(100) }).strict(),
  z.object({ tool: z.literal("watches.search"), query: z.string().trim().min(3).max(100) }).strict(),
  z.object({ tool: z.literal("accessories.search"), query: z.string().trim().min(3).max(100) }).strict(),
  z.object({ tool: z.literal("watches.detail"), productId: z.string().min(1).max(100) }).strict(),
  z.object({ tool: z.literal("work.open"), productId: z.string().min(1).max(100), customerId: z.string().min(1).max(100) }).strict(),
]);
export type LookupRequest = z.infer<typeof lookupRequestSchema>;
export const followupKinds = ["VERIFY_ACCESSORY", "SOURCE_ACCESSORY", "TECHNICAL_CHECK", "CHECK_AVAILABILITY", "SALES_FOLLOWUP"] as const;
export const followupDefinitions = {
  VERIFY_ACCESSORY: { label: "Kiểm tra phụ kiện tương thích", department: "TECHNICAL" },
  SOURCE_ACCESSORY: { label: "Tìm nguồn và xác nhận phụ kiện", department: "OPERATION" },
  TECHNICAL_CHECK: { label: "Xác minh tình trạng kỹ thuật", department: "TECHNICAL" },
  CHECK_AVAILABILITY: { label: "Xác minh khả năng cung ứng", department: "OPERATION" },
  SALES_FOLLOWUP: { label: "Theo dõi và phản hồi tư vấn", department: "SALES" },
} as const;
export const intakePlanSchema = z.object({
  summary: note.min(1), questions: z.array(note.min(1)).max(10),
  leads: z.array(z.object({
    key: z.string().regex(/^[a-z][a-z0-9-]{0,29}$/), customerId: z.string().min(1).max(100).nullable(), productId: z.string().min(1).max(100).nullable(),
    followups: z.array(z.object({ kind: z.enum(followupKinds), description: note.min(1) }).strict()).min(1).max(5),
  }).strict()).max(MAX_LEADS),
}).strict().superRefine((plan, ctx) => {
  if (!plan.questions.length && (!plan.leads.length || plan.leads.some(lead => !lead.customerId || !lead.productId))) ctx.addIssue({ code: "custom", message: "Thiếu khách hoặc sản phẩm đã xác minh" });
  if (new Set(plan.leads.map(lead => lead.key)).size !== plan.leads.length) ctx.addIssue({ code: "custom", message: "Mã yêu cầu bị trùng" });
  const pairs = plan.leads.filter(lead => lead.customerId && lead.productId).map(lead => JSON.stringify([lead.customerId, lead.productId]));
  if (new Set(pairs).size !== pairs.length) ctx.addIssue({ code: "custom", message: "Khách/watch bị lặp trong cùng yêu cầu" });
  for (const lead of plan.leads) {
    if (new Set(lead.followups.map(item => item.kind)).size !== lead.followups.length) ctx.addIssue({ code: "custom", message: "Loại việc bị trùng trong cùng yêu cầu" });
    if (!plan.questions.length && !lead.followups.some(item => item.kind === "SALES_FOLLOWUP")) ctx.addIssue({ code: "custom", message: "Cần việc theo dõi phản hồi cho Sale" });
  }
});
export type IntakePlan = z.infer<typeof intakePlanSchema>;
export type LookupEvidence = { id: string; request: LookupRequest; at: string; result: Record<string, unknown> };
