import { PrismaClient, Prisma, ProductType, Vendor } from "@prisma/client";
import { DB, dbOrTx, prisma } from "@/server/db/client";

export type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];
export type VendorOptions = { id: string; name: string };
export type BrandOption = { id: string; name: string };
//export const upsertSupplierByNameRoleTx = (db: Db) => async (p: {
//name: string; phone?: string | null; email?: string | null;
//}) => {
//const r = await db.vendor.upsert({
// where: { name_role: { name: p.name, role: 'SUPPLIER' } },
//update: { phone: p.phone ?? undefined, email: p.email ?? undefined },
//create: { name: p.name, role: 'SUPPLIER', phone: p.phone ?? null, email: p.email ?? null },
// select: { id: true },
// });
//return r.id;
//};


// Lấy danh sách vendor (có thể phân trang/filter nếu cần)
export async function getListVendors(
    tx: DB,
    opts?: { q?: string; take?: number; skip?: number }
) {
    return tx.vendor.findMany({
        where: opts?.q
            ? { name: { contains: opts.q, mode: "insensitive" } }
            : undefined,
        take: opts?.take ?? 100,
        skip: opts?.skip ?? 0,
        orderBy: { name: "asc" },
        select: { id: true, name: true, phone: true, email: true },
    });
}

export async function getVendorByName(tx: DB, name: string) {
    const db = dbOrTx(tx)
    const vendor = await db.vendor.findUnique({
        where: { name },
        select: {
            id: true
        }
    })
    return vendor?.id
}

// Tạo vendor mới
export async function createVendor(
    tx: Tx,
    data: { name: string; phone: string; email?: string | null }
) {
    // Kiểm tra số điện thoại đã tồn tại chưa
    const exists = await tx.vendor.findUnique({ where: { phone: data.phone } });
    if (exists) throw new Error("Số điện thoại đã tồn tại!");
    return tx.vendor.create({
        data,
        select: { id: true, name: true, phone: true, email: true },
    });
}

// Tìm vendor theo số điện thoại
export async function getVendorByPhone(tx: Tx, phone: string) {
    return tx.vendor.findUnique({ where: { phone } });
}

// Tìm vendor theo id
export async function getVendorById(tx: Tx, id: string) {
    return tx.vendor.findUnique({ where: { id }, select: { id: true, name: true, phone: true, email: true } });
}
export async function getListBrands(): Promise<BrandOption[]> {
    const brands = await prisma.brand.findMany({

        select: {
            name: true,
            id: true,
            _count: {
                select: { products: true },
            }
        },
        orderBy: { name: "asc" },
    });
    const brandsWithCount = brands.map(b => ({
        id: b.id,
        name: b.name,
        productCount: b._count.products,
    }));

    return brandsWithCount;
}