import { getAdminOrderDetail } from "../_servers/order.service";
import OrderDetailClient from "./_client/OrderDetailClient";

export default async function OrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const data = await getAdminOrderDetail(id);

    return (
        <div className="mx-auto w-full max-w-[1500px] px-4 pt-6 lg:px-6">
            <OrderDetailClient data={data} />
        </div>
    );
}