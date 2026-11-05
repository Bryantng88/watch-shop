import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { getCurrentUserPermissions } from "@/server/auth/requirePermission";
import { listSalesIntakes, requestSalesIntake, cancelSalesIntake } from "@/domains/sales-intake/server/intake.service";
import { SalesIntakeError } from "@/domains/sales-intake/server/intake-access";

async function handle(req: NextRequest, write: boolean) {
  try {
    const { user } = await getCurrentUserPermissions();
    if (!user) return NextResponse.json({ error: "Cần đăng nhập." }, { status: 401 });
    if (!write) return NextResponse.json(await listSalesIntakes(user.id));
    if (!process.env.APP_URL || req.headers.get("origin") !== new URL(process.env.APP_URL).origin) return NextResponse.json({ error: "Origin không hợp lệ." }, { status: 403 });
    const text = await req.text();
    if (text.length > 16000) return NextResponse.json({ error: "Yêu cầu quá dài." }, { status: 413 });
    const body = JSON.parse(text);
    if (req.method === "DELETE") return NextResponse.json(await cancelSalesIntake(user.id, z.object({ id: z.string().uuid() }).strict().parse(body).id));
    return NextResponse.json(await requestSalesIntake(user.id, body));
  } catch (error) {
    return NextResponse.json({ error: error instanceof SalesIntakeError ? error.message : error instanceof ZodError ? "Nội dung yêu cầu không hợp lệ." : "Không thể xử lý yêu cầu Sale." }, { status: error instanceof SalesIntakeError ? error.status : 400 });
  }
}
export async function GET(req: NextRequest) { return handle(req, false); }
export async function POST(req: NextRequest) { return handle(req, true); }

export async function DELETE(req: NextRequest) { return handle(req, true); }
