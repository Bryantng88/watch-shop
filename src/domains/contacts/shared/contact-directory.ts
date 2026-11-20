import { z } from "zod";

export type ContactKind = "customers" | "vendors";
export type DirectoryContact = {
  id: string; name: string; phone: string | null; email: string | null;
  address: string | null; updatedAt: string; role?: string; isActive?: boolean;
};
export type ContactPage = { items: DirectoryContact[]; page: number; pageSize: number; total: number };
const optionalText = (max: number) => z.string().trim().max(max);
export const contactInput = z.object({
  kind: z.enum(["customers", "vendors"]),
  id: z.string().min(1).max(100).optional(),
  updatedAt: z.string().datetime().optional(),
  name: z.string().trim().min(1, "Nhập tên liên hệ.").max(200),
  phone: optionalText(32),
  email: optionalText(254).refine(v => !v || z.email().safeParse(v).success, "Email không hợp lệ."),
  address: optionalText(1000),
}).strict().superRefine((value, context) => {
  if (value.kind === "customers" && !value.phone) context.addIssue({ code: "custom", path: ["phone"], message: "Nhập số điện thoại khách hàng." });
  if (value.id && !value.updatedAt) context.addIssue({ code: "custom", path: ["updatedAt"], message: "Tải lại thông tin trước khi sửa." });
});
