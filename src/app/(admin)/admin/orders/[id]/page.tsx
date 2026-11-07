import { orderCodexReady } from "@/domains/order/codex/workflow.service";
import {getCurrentUserPermissions} from "@/server/auth/requirePermission";
import { getAdminOrderDetail } from "@/domains/order/server";
import OrderDetailClient from "@/domains/order/client/OrderDetailClient";
import type { OrderDetailData } from "@/domains/order/ui/detail/shared";
import { serializeForClient } from "@/shared/utils/serialize-for-client";

export default async function OrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const data = await getAdminOrderDetail(id);

    const clientData = serializeForClient(data) as OrderDetailData;

    const {user}=await getCurrentUserPermissions();
    return <OrderDetailClient data={clientData} codexEnabled={orderCodexReady() && Boolean(user?.roles.includes("ADMIN"))} />;
}
