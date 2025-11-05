import { z } from "zod";
import { AcquisitionType } from "@prisma/client";
// sort dùng cho bảng admin
export const adminAcqSort = z.enum([
    "updatedDesc", "updatedAsc",
    "createdDesc", "createdAsc",
    "acquiredDesc", "acquiredAsc",
]);
// app/(admin)/admin/acquisitions/_server/acquisition.dto.ts



export const CreateAcqWithItemSchema = z.object({
    // acquisition
    vendorId: z.string().min(1, "vendorId required"),
    acquiredAt: z.coerce.date().optional(),   // mặc định: hôm nay
    currency: z.string().default("VND"),
    type: z.nativeEnum(AcquisitionType).default("PURCHASE"),
    notes: z.string().nullable().optional(),
    refNo: z.string().nullable().optional(),

    // reuse strategy (tùy chọn)
    reuse: z.enum(["always-new", "reuse-today", "reuse-latest"]).default("reuse-today"),

    // item(s)
    item: z.object({
        productId: z.string().min(1),
        variantId: z.string().nullable().optional(),
        quantity: z.coerce.number().int().positive().default(1),
        unitCost: z.coerce.number().nonnegative().default(0),
    })
    // Nếu muốn hỗ trợ nhiều dòng ngay khi tạo:
    // items: z.array(z.object({ ... như trên ... })).min(1)
});

export type CreateAcqWithItemInput = z.infer<typeof CreateAcqWithItemSchema>;

// bộ lọc Acquisition cho Admin list
export const acqFiltersSchema = z.object({
    page: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce.number().int().positive().max(200).optional(),
    q: z.string().trim().optional(),            // tìm refNo / notes
    vendorIds: z.array(z.string()).optional(),
    customerIds: z.array(z.string()).optional(),
    type: z.array(z.enum(["PURCHASE", "CONSIGN", "TRADEIN"])).optional(),
    status: z.array(z.enum(["DRAFT", "POSTED", "CANCELED"])).optional(),
    acquiredFrom: z.string().or(z.date()).optional(),
    acquiredTo: z.string().or(z.date()).optional(),
    hasInvoice: z.enum(["yes", "no"]).optional(),
    sort: adminAcqSort.optional(),
});

export type AdminAcqFiltersInput = z.infer<typeof acqFiltersSchema>;

export type CreateAcquisitionInput = {
    vendorId: string;
    currency?: string;
    type?: AcquisitionType;
    acquiredAt?: Date | string;
    notes?: string | null;
    items: { title: string; quantity: number; unitCost: number }[];
};