import { getAdminOrderDetail } from "@/domains/order/server";
import OrderDetailClient from "@/domains/order/client/OrderDetailClient";
import type { OrderDetailData } from "@/domains/order/OrderDetailClient";
import { serializeForClient } from "@/shared/utils/serialize-for-client";

export default async function OrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const data = await getAdminOrderDetail(id);

    const clientData = serializeForClient(data) as OrderDetailData;

    return <OrderDetailClient data={clientData} />;
}
