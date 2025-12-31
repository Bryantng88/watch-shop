// app/(admin)/admin/customers/_server/customers.service.ts
import * as repo from "./customer.repo";

export async function getCustomerList() {
    return repo.listCustomers();
}

export async function getCustomerById(id: string) {
    return repo.findCustomerById(id);
}

export async function searchCustomer(keyword: string) {
    if (!keyword || keyword.trim() === "") return [];

    return repo.searchCustomers(keyword.trim());
}

/**
 * Sử dụng cho BUY BACK:
 * - Nhập số điện thoại
 * - Nếu tồn tại → trả về thông tin khách
 * - Nếu chưa có → tạo mới
 */
export async function getOrCreateCustomer(phone: string, name?: string) {
    if (!phone) throw new Error("Phone is required");

    const existing = await repo.findCustomerByPhone(phone);
    if (existing) return { customer: existing, isNew: false };

    if (!name || name.trim() === "")
        throw new Error("Customer does not exist — name required for creation.");

    const created = await repo.createCustomer({
        name: name.trim(),
        phone,
    });

    return { customer: created, isNew: true };
}

export async function createCustomer(data: {
    name: string;
    phone: string;
    email?: string | null;
    address?: string | null;
}) {
    if (!data.name.trim()) throw new Error("Tên khách hàng bắt buộc");

    if (!data.phone.trim()) throw new Error("Số điện thoại bắt buộc");

    // check trùng số điện thoại
    const exists = await repo.findCustomerByPhone(data.phone);
    if (exists) throw new Error("Phone already used by another customer");

    return repo.createCustomer(data);
}

export async function updateCustomer(id: string, data: any) {
    return repo.updateCustomer(id, data);
}

// customer.service.ts
export async function searchCustomerService(phone?: string) {
    if (!phone || phone.length < 3) return [];
    return repo.searchCustomersByPhone(phone);
}
