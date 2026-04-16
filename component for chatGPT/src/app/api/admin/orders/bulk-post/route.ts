import { postOrders } from "@/app/(admin)/admin/orders/_servers/order.service";

export async function POST(req: Request) {
    const { orderIds, hasShipment } = await req.json();

    await postOrders(orderIds, hasShipment);

    return Response.json({ ok: true });
}
