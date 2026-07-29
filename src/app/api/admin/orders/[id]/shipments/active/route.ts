import { NextResponse } from "next/server";
import { getShipmentContextByOrderIdApplication } from "@/domains/shipment/application";
import { PERMISSIONS } from "@/constants/permissions";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
    const auth = await requirePermissionApi(PERMISSIONS.SHIPMENT_VIEW);
    if (auth instanceof Response) return auth;

    try {
        const data = await getShipmentContextByOrderIdApplication(ctx.params.id);
        return NextResponse.json(data);
    } catch (error: unknown) {
        return NextResponse.json(
            {
                error: error instanceof Error
                    ? error.message
                    : "Không thể tải shipment active của order.",
            },
            { status: 500 },
        );
    }
}
