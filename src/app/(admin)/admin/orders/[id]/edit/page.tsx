import { notFound } from "next/navigation";

import OrderFormClient from "@/domains/order/client/OrderFormClient";
import {
    getOrderDraftForEdit,
    getServiceCatalogOptions,
} from "@/domains/order/server";

function serialize<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

export default async function EditOrderPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const [draft, services] = await Promise.all([
        getOrderDraftForEdit(id),
        getServiceCatalogOptions(),
    ]);

    if (!draft) notFound();

    return (
        <div className="mx-auto w-full max-w-[1500px] px-4 pt-6 lg:px-6">
            <OrderFormClient
                key={id}
                mode="edit"
                orderId={id}
                initialData={serialize(draft)}
                services={serialize(services)}
                backHref={`/admin/orders/${id}`}
                backLabel="← Chi tiết"
            />
        </div>
    );
}