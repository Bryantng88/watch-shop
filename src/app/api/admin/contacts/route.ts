import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { contactAccess } from "@/domains/contacts/shared/contact-access";
import { ContactDirectoryError, listContacts, saveContact } from "@/domains/contacts/server/contact-directory.service";
import { contactInput } from "@/domains/contacts/shared/contact-directory";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  const kind = req.nextUrl.searchParams.get("kind");
  if (kind !== "customers" && kind !== "vendors") return NextResponse.json({ error: "Danh bạ không hợp lệ." }, { status: 400 });
  if (!contactAccess(user, kind).read) return NextResponse.json({ error: "Không có quyền xem danh bạ." }, { status: 403 });
  const page = Number(req.nextUrl.searchParams.get("page") || 1);
  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (!Number.isSafeInteger(page) || page < 1 || page > 100000 || q.length > 200) return NextResponse.json({ error: "Bộ lọc không hợp lệ." }, { status: 400 });
  try { return NextResponse.json(await listContacts(kind, q, page), { headers: { "Cache-Control": "no-store" } }); }
  catch { return NextResponse.json({ error: "Không tải được danh bạ. Thử lại sau." }, { status: 500 }); }
}
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  try {
    const input = contactInput.parse(await req.json());
    const access = contactAccess(user, input.kind);
    if (!access.read || !(input.id ? access.update : access.create)) return NextResponse.json({ error: "Không có quyền lưu liên hệ." }, { status: 403 });
    return NextResponse.json({ item: await saveContact(input) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: "Kiểm tra thông tin liên hệ.", fields: error.flatten().fieldErrors }, { status: 400 });
    if (error instanceof ContactDirectoryError) return NextResponse.json({ error: error.message }, { status: error.status });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return NextResponse.json({ error: "Thông tin trùng với một liên hệ đã có. Kiểm tra tên và email." }, { status: 409 });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") return NextResponse.json({ error: "Danh bạ vừa thay đổi. Kiểm tra lại rồi thử lưu lại." }, { status: 409 });
    return NextResponse.json({ error: "Không lưu được liên hệ. Nội dung đang sửa được giữ lại." }, { status: 400 });
  }
}
