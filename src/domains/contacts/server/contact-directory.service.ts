import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { contactInput, type ContactKind } from "../shared/contact-directory";

export class ContactDirectoryError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
const select = { id: true, name: true, phone: true, email: true, address: true, updatedAt: true } as const;
export async function listContacts(kind: ContactKind, q: string, page: number) {
  const pageSize = 30;
  const where = q ? { OR: ["name", "phone", "email"].map(field => ({ [field]: { contains: q, mode: "insensitive" as const } })) } : {};
  // A single database snapshot keeps the page count and rows consistent.
  return prisma.$transaction(async tx => {
    const args = { where, orderBy: [{ name: "asc" as const }, { id: "asc" as const }], skip: (page - 1) * pageSize, take: pageSize, select };
    const items = kind === "customers" ? await tx.customer.findMany(args) : await tx.vendor.findMany({ ...args, select: { ...select, role: true, isActive: true } });
    const total = kind === "customers" ? await tx.customer.count({ where }) : await tx.vendor.count({ where });
    return { items, total, page, pageSize };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });
}
export async function saveContact(raw: unknown) {
  const input = contactInput.parse(raw);
  const data = { name: input.name, phone: input.phone || null, email: input.email || null, address: input.address || null };
  return prisma.$transaction(async tx => {
    if (input.kind === "customers" && input.phone) {
      const duplicate = await tx.customer.findFirst({ where: { phone: input.phone, ...(input.id ? { id: { not: input.id } } : {}) }, select: { id: true } });
      if (duplicate) {
        const current = input.id ? await tx.customer.findUnique({ where: { id: input.id }, select: { phone: true } }) : null;
        // Historical shared phone numbers must not block unrelated edits.
        if (!current || current.phone !== input.phone) throw new ContactDirectoryError("Số điện thoại đã thuộc một khách hàng khác.", 409);
      }
    }
    if (!input.id) {
      return input.kind === "customers" ? tx.customer.create({ data, select }) : tx.vendor.create({ data, select });
    }
    const where = { id: input.id, updatedAt: new Date(input.updatedAt!) };
    const result = input.kind === "customers" ? await tx.customer.updateMany({ where, data }) : await tx.vendor.updateMany({ where, data });
    if (result.count !== 1) throw new ContactDirectoryError("Thông tin đã được thay đổi ở nơi khác. Tải lại liên hệ rồi kiểm tra bản đang sửa.", 409);
    return input.kind === "customers" ? tx.customer.findUniqueOrThrow({ where: { id: input.id }, select }) : tx.vendor.findUniqueOrThrow({ where: { id: input.id }, select });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}
