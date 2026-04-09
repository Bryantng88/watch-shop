import { NextResponse } from "next/server";
import * as acquisitionService from "@/app/(admin)/admin/acquisitions/_server/acquisition.service";

function serializeError(error: unknown) {
    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
            stack: error.stack,
            cause:
                error.cause instanceof Error
                    ? {
                        name: error.cause.name,
                        message: error.cause.message,
                        stack: error.cause.stack,
                    }
                    : error.cause ?? null,
        };
    }

    return {
        name: "UnknownError",
        message: String(error),
        stack: null,
        cause: null,
    };
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json().catch(() => ({}));

        console.log("[ACQ_POST_ROUTE][INPUT]", {
            id,
            body,
        });

        const result = await acquisitionService.postAcquisition(
            id,
            String(body?.vendorName ?? "").trim()
        );

        console.log("[ACQ_POST_ROUTE][OK]", { id });

        return NextResponse.json(result);
    } catch (error) {
        const detail = serializeError(error);

        console.error("[ACQ_POST_ROUTE][ERROR]", detail);

        return NextResponse.json(
            {
                error: detail.message,
                detail,
            },
            { status: 500 }
        );
    }
}