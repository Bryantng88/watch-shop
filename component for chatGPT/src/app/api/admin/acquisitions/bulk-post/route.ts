import { NextRequest, NextResponse } from "next/server";
import * as service from "@/old_files/Acquisition_server/acquisition.service";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));

        const acquisitionIds = Array.isArray(body?.acquisitionIds)
            ? body.acquisitionIds.filter(
                (x: unknown): x is string =>
                    typeof x === "string" && x.trim().length > 0
            )
            : Array.isArray(body?.items)
                ? body.items
                    .map((item: any) => item?.id)
                    .filter(
                        (x: unknown): x is string =>
                            typeof x === "string" && x.trim().length > 0
                    )
                : [];

        if (!acquisitionIds.length) {
            return NextResponse.json(
                { ok: false, error: "Thiếu acquisitionIds" },
                { status: 400 }
            );
        }

        const result = await service.postMultipleAcquisitions(acquisitionIds);

        if (result.failed.length > 0) {
            return NextResponse.json(
                {
                    ok: false,
                    posted: result.posted,
                    failed: result.failed,
                    error: `Có ${result.failed.length} phiếu duyệt lỗi`,
                },
                { status: 207 }
            );
        }

        return NextResponse.json({
            ok: true,
            posted: result.posted,
            failed: [],
        });
    } catch (e: any) {
        return NextResponse.json(
            { ok: false, error: e?.message || "Bulk post failed" },
            { status: 500 }
        );
    }
}