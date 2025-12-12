import { z } from "zod";
import type { Prisma } from "@prisma/client";

// 🧭 Định nghĩa schema cho query string (giúp parse an toàn)
const acqSearchSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(200).default(50),
    q: z.string().optional(),
    vendorId: z.string().optional(),
    type: z.enum(["PURCHASE", "SALE", "RETURN"]).optional(),
    status: z.enum(["DRAFT", "POSTED", "CANCELLED"]).optional(),
    sort: z
        .enum([
            "updatedDesc",
            "updatedAsc",
            "createdDesc",
            "createdAsc",
            "acquiredDesc",
            "acquiredAsc",
        ])
        .default("updatedDesc"),
    from: z.string().optional(),
    to: z.string().optional(),
});

// 🧮 Kiểu output sau khi parse
export type AdminAcquisitionFilters = z.infer<typeof acqSearchSchema>;

/**
 * 🧰 Chuyển query string (URLSearchParams) → object filters gọn gàng, có kiểu
 * Dùng trong server component page.tsx
 */
export function parseAcqSearchParams(params: URLSearchParams): AdminAcquisitionFilters {
    const raw = Object.fromEntries(params.entries());
    const parsed = acqSearchSchema.safeParse(raw);
    if (parsed.success) return parsed.data;
    // fallback nếu có lỗi
    return { page: 1, pageSize: 50, sort: "updatedDesc" };
}

/**
 * 🧱 Dựng where clause cho Prisma (sử dụng trong repo)
 */
export function buildAcqWhere(f: AdminAcquisitionFilters): Prisma.AcquisitionWhereInput {
    return {
        ...(f.q
            ? {
                OR: [
                    { refNo: { contains: f.q, mode: "insensitive" } },
                    { notes: { contains: f.q, mode: "insensitive" } },
                ],
            }
            : {}),
        ...(f.vendorId ? { vendorId: f.vendorId } : {}),
        ...(f.type ? { type: f.type as any } : {}),
        ...(f.status ? { acquisitionStt: f.status as any } : {}),
        ...(f.from || f.to
            ? {
                acquiredAt: {
                    ...(f.from ? { gte: new Date(f.from) } : {}),
                    ...(f.to ? { lte: new Date(f.to) } : {}),
                },
            }
            : {}),
    };
}

/**
 * 🧭 Dựng orderBy cho Prisma
 */
export function buildAcqOrderBy(
    sort?: AdminAcquisitionFilters["sort"]
): Prisma.AcquisitionOrderByWithRelationInput[] {
    switch (sort) {
        case "updatedAsc":
            return [{ updatedAt: "asc" }];
        case "updatedDesc":
            return [{ updatedAt: "desc" }];
        case "createdAsc":
            return [{ createdAt: "asc" }];
        case "createdDesc":
            return [{ createdAt: "desc" }];
        case "acquiredAsc":
            return [{ acquiredAt: "asc" }];
        case "acquiredDesc":
            return [{ acquiredAt: "desc" }];
        default:
            return [{ updatedAt: "desc" }];
    }
}
