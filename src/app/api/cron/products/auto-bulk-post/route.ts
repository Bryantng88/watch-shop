import { NextResponse } from "next/server";
import { autoBulkPostDraftProducts } from "@/app/(admin)/admin/products/_server/product.service";

function resolveCronToken(req: Request) {
    const authHeader = req.headers.get("authorization") || "";
    const bearer = authHeader.toLowerCase().startsWith("bearer ")
        ? authHeader.slice(7).trim()
        : "";
    const headerToken = req.headers.get("x-cron-secret") || "";
    const url = new URL(req.url);
    const queryToken = url.searchParams.get("secret") || "";

    return bearer || headerToken || queryToken;
}

async function run(req: Request) {
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
        return NextResponse.json(
            { message: "CRON_SECRET is not configured" },
            { status: 500 }
        );
    }

    const token = resolveCronToken(req);
    if (token !== cronSecret) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const result = await autoBulkPostDraftProducts();
        return NextResponse.json({
            ok: true,
            ...result,
        });
    } catch (e: any) {
        return NextResponse.json(
            { message: e?.message || "Auto bulk post failed" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    return run(req);
}

export async function POST(req: Request) {
    return run(req);
}
