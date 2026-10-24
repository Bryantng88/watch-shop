import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { PERMISSIONS } from "@/constants/permissions";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import {
  ContentConflict,
  createArticle,
  getEditorRecord,
  listArticles,
  saveContent,
} from "@/domains/storefront/content/service";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;
  const id = req.nextUrl.searchParams.get("id") || "home";
  const [record, articles] = await Promise.all([getEditorRecord(id), listArticles(true)]);
  return NextResponse.json({ record, articles }, { headers: { "Cache-Control": "no-store" } });
}
export async function POST(req: NextRequest) {
  const auth = await requirePermissionApi(PERMISSIONS.PRODUCT_UPDATE);
  if (auth instanceof Response) return auth;
  try {
    const body = await req.json();
    if (body.action === "create")
      return NextResponse.json({ record: await createArticle(auth.id) });
    const input = z
      .object({
        id: z.string().min(1).max(100),
        revision: z.number().int().nonnegative(),
        action: z.enum(["save", "publish", "unpublish"]),
        content: z.unknown().optional(),
      })
      .parse(body);
    await saveContent(input, auth.id);
    return NextResponse.json({ record: await getEditorRecord(input.id) });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof z.ZodError
            ? error.issues[0]?.message
            : error instanceof Prisma.PrismaClientKnownRequestError
              ? error.code === "P2002"
                ? "Slug này đã được một bài khác sử dụng. Hãy đổi slug."
                : "Không thể lưu dữ liệu. Vui lòng thử lại."
              : error instanceof Error
                ? error.message
                : "Không thể lưu nội dung.",
      },
      { status: error instanceof ContentConflict ? 409 : 400 },
    );
  }
}
