import OrderFormClient from "../../_client/OrderForm";
import { getOrderDraftForEdit, serialize } from "@/app/(admin)/admin/orders/_servers/order.service";


export default async function EditOrderPage({ params }: { params: { id: string } }) {
    const draft = await getOrderDraftForEdit(params.id);
    const initial = serialize(draft);

    return (
        <OrderFormClient
            key={params.id}
            mode="edit"
            orderId={params.id}
            initialData={initial as any}
        />
    );
}
