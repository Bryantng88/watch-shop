import { NextRequest, NextResponse } from "next/server";

import { postAcquisitionApplication } from "@/domains/acquisition/application";

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
                {
                    ok: false,
                    posted: [],
                    failed: [],
                    error: "Thiếu acquisitionIds",
                },
                { status: 400 }
            );
        }

        const posted: any[] = [];
        const failed: { id: string; error: string }[] = [];

        for (const acquisitionId of acquisitionIds) {
            try {
                const result = await postAcquisitionApplication({
                    acquisitionId,
                });

                posted.push(result);
            } catch (error: any) {
                failed.push({
                    id: acquisitionId,
                    error: error?.message || "Duyệt phiếu thất bại",
                });
            }
        }

        if (failed.length > 0 && posted.length === 0) {
            return NextResponse.json(
                {
                    ok: false,
                    posted: [],
                    failed,
                    error: failed[0]?.error || "Duyệt phiếu thất bại",
                },
                { status: 409 }
            );
        }

        if (failed.length > 0) {
            return NextResponse.json(
                {
                    ok: false,
                    posted,
                    failed,
                    error: `Có ${failed.length} phiếu duyệt lỗi`,
                },
                { status: 207 }
            );
        }

        return NextResponse.json({
            ok: true,
            posted,
            failed: [],
        });
    } catch (e: any) {
        return NextResponse.json(
            {
                ok: false,
                posted: [],
                failed: [],
                error: e?.message || "Bulk post failed",
            },
            { status: 500 }
        );
    }
}