import { NextResponse } from "next/server";
import {
    createQuickIssueForActiveWatchService,
    getActiveWatchService,
    getOrCreateActiveWatchService,
} from "@/domains/service/server/watch-quick";

type RouteContext = {
    params?: Promise<Record<string, string>>;
};

function productIdFromUrl(req: Request) {
    const url = new URL(req.url);
    return String(url.searchParams.get("productId") ?? "").trim();
}

export async function GET(req: Request, _context: RouteContext) {
    try {
        const productId = productIdFromUrl(req);
        if (!productId) {
            return NextResponse.json({ error: "Missing productId" }, { status: 400 });
        }

        const data = await getActiveWatchService({ productId });

        return NextResponse.json({
            ok: true,
            data,
        });
    } catch (error: any) {
        console.error("[WATCH_ACTIVE_SERVICE][GET]", error);
        return NextResponse.json(
            { error: error?.message || "Load active service request failed" },
            { status: 500 },
        );
    }
}

export async function POST(req: Request, _context: RouteContext) {
    try {
        const body = await req.json().catch(() => ({}));
        const productId = String(body?.productId ?? "").trim();

        if (!productId) {
            return NextResponse.json({ error: "Missing productId" }, { status: 400 });
        }

        const data = await getOrCreateActiveWatchService({ productId });

        return NextResponse.json({
            ok: true,
            data,
        });
    } catch (error: any) {
        console.error("[WATCH_ACTIVE_SERVICE][POST]", error);
        return NextResponse.json(
            { error: error?.message || "Open active service request failed" },
            { status: 500 },
        );
    }
}

export async function PATCH(req: Request, _context: RouteContext) {
    try {
        const body = await req.json().catch(() => ({}));

        const data = await createQuickIssueForActiveWatchService({
            productId: body?.productId,
            serviceRequestId: body?.serviceRequestId,
            area: body?.area,
            priority: body?.priority,
            summary: body?.summary,
            note: body?.note,
            issueType: body?.issueType,
        });

        return NextResponse.json({
            ok: true,
            data,
            message: "Đã thêm technical issue",
        });
    } catch (error: any) {
        console.error("[WATCH_ACTIVE_SERVICE][PATCH]", error);
        return NextResponse.json(
            { error: error?.message || "Create technical issue failed" },
            { status: 400 },
        );
    }
}
