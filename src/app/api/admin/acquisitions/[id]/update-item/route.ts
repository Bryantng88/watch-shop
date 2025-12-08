import prisma from "@/server/db/client";
import * as serviceAqc from "@/app/(admin)/admin/acquisitions/_server/acquisition.service"

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id: acqId } = await context.params;
    const { items } = await req.json();

    try {
        const result = await prisma.$transaction(tx =>
            serviceAqc.updateAcquisitionItems(tx, acqId, items)
        );

        return Response.json(result, { status: 200 });
    } catch (err: any) {
        console.error(err);
        return Response.json(
            { error: err?.message ?? "Failed to update acquisition items" },
            { status: 500 }
        );
    }
}
