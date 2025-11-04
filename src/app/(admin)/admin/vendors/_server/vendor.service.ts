import prisma from "@/server/db/client";
import * as vendorRepo from "./vendor.repo";

// Lấy danh sách vendor cho client (all, thường dùng cho dropdown)
export async function getVendorList(q?: string) {
    return prisma.$transaction((tx) => vendorRepo.listVendors(tx, { q }));
}

// Tạo vendor mới (kèm kiểm tra số điện thoại duy nhất)
export async function createNewVendor(
    data: { name: string; phone: string; email?: string | null }
) {
    return prisma.$transaction((tx) => vendorRepo.createVendor(tx, data));
}

// Tìm vendor theo số điện thoại (cho chức năng quick check khi add)
export async function findVendorByPhone(phone: string) {
    return prisma.$transaction((tx) => vendorRepo.findVendorByPhone(tx, phone));
}

// Tìm vendor theo id
export async function getVendorById(id: string) {
    return prisma.$transaction((tx) => vendorRepo.getVendorById(tx, id));
}
