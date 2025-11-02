import { z } from "zod";

// sort dùng cho bảng admin
export const adminAcqSort = z.enum([
    "updatedDesc", "updatedAsc",
    "createdDesc", "createdAsc",
    "acquiredDesc", "acquiredAsc",
]);

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
