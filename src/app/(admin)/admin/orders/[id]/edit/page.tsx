import { notFound } from "next/navigation";
import OrderFormClient from "../../_client/OrderForm";
import { getOrderDraftForEdit, getServiceCatalogOptions } from "../../_servers/order.service";

export default async function EditOrderPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const [data, services] = await Promise.all([
        getOrderDraftForEdit(id),
        getServiceCatalogOptions(),
    ]);

    if (!data) return notFound();

    return (
        <div className="mx-auto w-full max-w-[1500px] px-4 pt-6 lg:px-6">
            <OrderFormClient
                mode="edit"
                initialData={data}
                services={services}
                backHref={`/admin/orders/${id}`}
                backLabel="← Chi tiết"
            />
        </div>
    );
}