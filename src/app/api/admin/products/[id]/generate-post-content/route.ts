import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/server/db/client";
import { s3, S3_BUCKET } from "@/server/s3";
import { normalizeKey } from "@/server/lib/product-image-storage";
import { requirePermissionApi } from "@/server/auth/requirePermissionApi";
import { PERMISSIONS } from "@/constants/permissions";

type Ctx = { params: Promise<{ id: string }> };

const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const OPENAI_URL = "https://api.openai.com/v1/responses";

function compactLines(values: Array<string | null | undefined>) {
  return values.map((v) => String(v ?? "").trim()).filter(Boolean).join("\n");
}

function toDataUrl(mime: string | undefined, bytes: Buffer) {
  const contentType = mime || "image/jpeg";
  return `data:${contentType};base64,${bytes.toString("base64")}`;
}

async function loadImageDataUrl(fileKey: string | null | undefined) {
  const key = normalizeKey(fileKey);
  if (!key) return null;

  const obj = await s3.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }));
  if (!obj.Body) return null;

  const chunks: Uint8Array[] = [];
  for await (const chunk of obj.Body as any) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (!chunks.length) return null;

  return toDataUrl(obj.ContentType || undefined, Buffer.concat(chunks));
}

function buildPrompt(product: any, userPrompt?: string | null) {
  const ws = product?.watchSpec ?? {};
  const variant = product?.variants?.[0] ?? null;
  const imageCount = Array.isArray(product?.image) ? product.image.length : 0;

  return compactLines([
    "Bạn là copywriter chuyên viết nội dung bán đồng hồ vintage tại Việt Nam.",
    "Hãy viết nội dung post bán hàng bằng tiếng Việt, giọng tinh gọn, tự nhiên, giàu cảm giác nhưng không phóng đại và không bịa chi tiết không có dữ liệu.",
    "Đầu ra gồm 3 phần theo đúng thứ tự:",
    "1) Tiêu đề in hoa 1 dòng.",
    "2) Đoạn mô tả 2-4 câu, nhấn mạnh form dáng, mặt số, chất liệu, bộ máy, độ mới hoặc tính chất sưu tầm nếu có căn cứ.",
    "3) Dòng cuối cùng là list ngắn các ý chính, ngăn cách bằng dấu chấm giữa.",
    "Không dùng emoji. Không thêm hashtag. Không tự suy diễn năm sản xuất nếu dữ liệu không chắc chắn.",
    userPrompt || null,
    "--- DỮ LIỆU SẢN PHẨM ---",
    `Tên sản phẩm: ${product?.title ?? ""}`,
    `Thương hiệu: ${product?.brand?.name ?? ""}`,
    `Vendor: ${product?.vendor?.name ?? ""}`,
    `SKU: ${variant?.sku ?? ""}`,
    `Giá bán: ${variant?.price ?? ""}`,
    `Reference: ${ws?.ref ?? ""}`,
    `Model: ${ws?.model ?? ""}`,
    `Năm: ${ws?.year ?? ""}`,
    `Dáng vỏ: ${ws?.caseType ?? ""}`,
    `Máy: ${ws?.movement ?? ""}`,
    `Caliber: ${ws?.caliber ?? ""}`,
    `Chất liệu vỏ: ${ws?.caseMaterial ?? ""}`,
    `Màu mặt: ${ws?.dialColor ?? ""}`,
    `Dây: ${ws?.strap ?? ""}`,
    `Kính: ${ws?.glass ?? ""}`,
    `Kèm hộp: ${ws?.boxIncluded ? "Có" : "Không rõ/Không"}`,
    `Kèm sổ: ${ws?.bookletIncluded ? "Có" : "Không rõ/Không"}`,
    `Kèm thẻ: ${ws?.cardIncluded ? "Có" : "Không rõ/Không"}`,
    `Đã service: ${ws?.isServiced ? "Có" : "Chưa rõ"}`,
    `Mô tả hiện có: ${product?.description ?? ""}`,
    `Số ảnh gửi kèm: ${imageCount}`,
  ]);
}

function extractOutputText(payload: any) {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const text = (payload?.output ?? [])
    .flatMap((item: any) => item?.content ?? [])
    .map((part: any) => part?.text)
    .filter((value: unknown) => typeof value === "string" && value.trim().length > 0)
    .join("\n\n")
    .trim();

  return text;
}

export async function POST(req: NextRequest, ctx: Ctx) {
  await requirePermissionApi(PERMISSIONS.productUpdate);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Thiếu OPENAI_API_KEY" }, { status: 500 });
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const userPrompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      brand: { select: { name: true } },
      vendor: { select: { name: true } },
      watchSpec: true,
      image: {
        where: { role: { in: ["PRIMARY", "GALLERY"] } },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        take: 4,
        select: { fileKey: true },
      },
      variants: {
        orderBy: [{ updatedAt: "desc" }, { createdAt: "asc" }],
        take: 1,
        select: { sku: true, price: true },
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
  }

  const promptUsed = buildPrompt(product, userPrompt);
  const imageDataUrls = (
    await Promise.all((product.image || []).map((img) => loadImageDataUrl(img.fileKey)))
  ).filter(Boolean) as string[];

  const openAiRes = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: promptUsed },
            ...imageDataUrls.map((url) => ({ type: "input_image", image_url: url })),
          ],
        },
      ],
    }),
  });

  const payload = await openAiRes.json().catch(() => null);
  if (!openAiRes.ok) {
    return NextResponse.json(
      { error: payload?.error?.message || "OpenAI phản hồi lỗi", detail: payload },
      { status: openAiRes.status }
    );
  }

  const content = extractOutputText(payload);
  if (!content) {
    return NextResponse.json({ error: "AI không trả về nội dung hợp lệ", detail: payload }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    content,
    promptUsed,
    model: DEFAULT_MODEL,
    imageCount: imageDataUrls.length,
  });
}
