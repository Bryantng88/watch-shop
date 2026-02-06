import { NextResponse } from "next/server";
import prisma from "@/server/db/client";
import * as  serviceRequest from "@/app/(admin)/admin/services/_server/service_request.service"
import { ServiceScope } from "@prisma/client";

export async function GET(req: Request) {
    const url = new URL(req.url);

    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
    const q = url.searchParams.get("q");
    const isActiveRaw = url.searchParams.get("isActive"); // "true" | "false" | null

    const isActive =
        isActiveRaw === null ? null : isActiveRaw === "true" ? true : false;

    const result = await serviceRequest.getAdminServiceRequestList(
        {
            page,
            pageSize,
            q: q?.trim() || null,
            isActive,
        }
    );
    return NextResponse.json(result);
}

