import Link from "next/link";
import { getAdminOrderDetail } from "../_servers/order.service";
import OrderDetailClient from "./_client/OrderDetailClient";


export default async function OrderDetailPage({ params }: { params: { id: string } }) {
    const data = await getAdminOrderDetail(params.id);


    return (
        <div className="space-y-4">


            <OrderDetailClient data={data} />
        </div>
    );
}


