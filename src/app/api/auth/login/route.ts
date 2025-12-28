// app/api/admin/auth/login/route.ts
import { NextResponse } from "next/server";
import { loginService } from "@/app/(admin)/admin/auth/_server/auth.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const user = await loginService(body);

        return NextResponse.json({ user });
    } catch (e: any) {
        return NextResponse.json(
            { error: e.message || "Login failed" },
            { status: 401 }
        );
    }
}
