// app/(admin)/admin/orders/_server/order.service.ts
import { repoOrder } from "./order.repo";
import { OrderSearchInput } from "../utils/search-params";

export async function getAdminOrderList(input: OrderSearchInput) {
    const { page, pageSize, q } = input;

    const where = q
        ? {
            OR: [
                { refNo: { contains: q, mode: "insensitive" } },
                { customerName: { contains: q, mode: "insensitive" } },
                { customerPhone: { contains: q, mode: "insensitive" } },
            ],
        }
        : {};

    return repoOrder.getList({ page, pageSize, where });
}
