import { after, NextResponse } from "next/server";
import { saveTechnicalAssessment } from "@/domains/service/server";
import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";

export async function POST(req: Request) {
    try {
        const actor = await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
        const body = await req.json().catch(() => ({}));
        const result = await saveTechnicalAssessment({
            ...body,
            actorUserId: actor.id,
            deferConsumers: (work: () => Promise<void>) => after(work),
        });

        return NextResponse.json({
            ok: true,
            data: result,
        });
    } catch (error: unknown) {
        console.error(error);

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Save technical assessment failed",
            },
            { status: 400 }
        );
    }
}
