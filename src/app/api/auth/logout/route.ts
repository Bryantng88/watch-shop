// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

import { getCurrentUserPermissions } from "@/server/auth/requirePermission";
import { prisma } from "@/server/db/client";

export async function POST(req: NextRequest) {
    const endpoint = req.cookies.get("ben_push_endpoint")?.value;
    if (endpoint) {
      const {user} = await getCurrentUserPermissions();
      if (user) await prisma.benPushSubscription.deleteMany({where:{userId:user.id,endpoint}});
    }
    const res = NextResponse.json({ ok: true });

    res.cookies.set("auth_token", "", {
        path: "/",
        maxAge: 0,
    });

    res.cookies.set("ben_push_endpoint","",{path:"/",maxAge:0});
    return res;
}
