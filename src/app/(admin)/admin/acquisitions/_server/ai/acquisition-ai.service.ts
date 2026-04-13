"use server";

import OpenAI from "openai";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "@/server/s3";
import { normalizeKey } from "@/server/lib/product-image-storage";

type GenerateAcquisitionDraftInput = {
    origin: string;
    imageUrls: string[];
    imageEntries?: Array<{ key?: string | null; url?: string | null }>;
    titleHint?: string | null;
    hintText?: string | null;
    vendorName?: string | null;
    cost?: number | null;
};

type GenerateAcquisitionDraftResult = {
    extractedSpec?: any;
    generatedDraft?: any | null;
    meta?: any;
};

function getOpenAIClient() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Thiếu OPENAI_API_KEY");
    return new OpenAI({ apiKey });
}

function toAbsoluteUrl(input: string, origin: string) {
    if (!input) return "";
    if (/^https?:\/\//i.test(input) || input.startsWith("data:")) return input;
    if (input.startsWith("/")) return `${origin}${input}`;
    return `${origin}/${input.replace(/^\/+/, "")}`;
}

async function streamToBuffer(body: any): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of body as any) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
}

async function fetchImageAsDataUrl(imageUrl: string, origin: string) {
    const absoluteUrl = toAbsoluteUrl(imageUrl, origin);
    const res = await fetch(absoluteUrl);

    if (!res.ok) throw new Error(`Không tải được ảnh: ${res.status}`);

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
}

async function fetchImageEntryAsDataUrl(
    entry: { key?: string | null; url?: string | null },
    origin: string
) {
    const normalized = normalizeKey(entry?.key);

    if (normalized) {
        try {
            const object = await s3.send(
                new GetObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: normalized,
                })
            );

            if (!object.Body) {
                throw new Error("S3 object body empty");
            }

            const contentType = object.ContentType || "image/jpeg";
            const buffer = await streamToBuffer(object.Body);
            const base64 = buffer.toString("base64");
            return `data:${contentType};base64,${base64}`;
        } catch (error) {
            console.error("[ACQ_AI][FETCH_BY_KEY_FAILED]", {
                key: normalized,
                error: error instanceof Error ? error.message : error,
            });
        }
    }

    const rawUrl = String(entry?.url ?? "").trim();
    if (!rawUrl) {
        throw new Error("Image entry không có key/url hợp lệ.");
    }

    return fetchImageAsDataUrl(rawUrl, origin);
}

function buildPrompt(input: GenerateAcquisitionDraftInput) {
    return `
Bạn là AI hỗ trợ phân tích đồng hồ/vật phẩm từ phiếu nhập để tạo dữ liệu spec ban đầu cho hệ thống inventory.

Nhiệm vụ:
1. Phân tích ảnh + title hint + hint text.
2. Trả về JSON object hợp lệ.
3. Nếu không chắc chắn, vẫn có thể đưa probable / suggested facts.
4. Không bịa dữ liệu quá cụ thể nếu ảnh không đủ rõ.

Ngữ cảnh:
- titleHint: ${input.titleHint ?? ""}
- hintText: ${input.hintText ?? ""}
- vendorName: ${input.vendorName ?? ""}
- cost: ${input.cost ?? 0}

Yêu cầu JSON schema:

{
  "extractedSpec": {
    "brandName": string | null,
    "modelFamily": string | null,
    "bestRefCandidate": string | null,
    "bestCaliberCandidate": string | null,
    "yearEstimate": string | null,
    "movement": string | null,
    "caseType": string | null,
    "caseMaterial": string | null,
    "dialColor": string | null,
    "glass": string | null,
    "strapType": string | null,
    "gender": string | null,
    "goldKarat": number | null,
    "goldColor": string | null,
    "widthEstimateMm": number | null,
    "lengthEstimateMm": number | null,
    "thicknessEstimateMm": number | null,
    "confirmedFacts": {
      "brandName": string | null
    },
    "suggestedFacts": {
      "probableBrand": string | null
    },
    "probableVisualFacts": {
      "probableBrand": string | null,
      "movement": string | null,
      "caseType": string | null,
      "caseMaterial": string | null,
      "dialColor": string | null,
      "strapType": string | null,
      "widthEstimateMm": number | null,
      "glass": string | null
    },
    "likelyAccessories": {
      "boxIncluded": boolean | null,
      "bookletIncluded": boolean | null,
      "cardIncluded": boolean | null
    }
  },
  "generatedDraft": {
    "listingCopy": string | null
  },
  "meta": {
    "confidence": number | null,
    "notes": string | null
  }
}

Chỉ trả về JSON. Không thêm markdown. Không thêm giải thích ngoài JSON.
`.trim();
}

function safeJsonParse<T = any>(value: string): T | null {
    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
}

export async function generateAcquisitionDraft(
    input: GenerateAcquisitionDraftInput
): Promise<GenerateAcquisitionDraftResult> {
    const client = getOpenAIClient();

    let imagePayloads: string[] = [];

    if (input.imageEntries?.length) {
        imagePayloads = await Promise.all(
            input.imageEntries.slice(0, 4).map((entry) => fetchImageEntryAsDataUrl(entry, input.origin))
        );
    } else {
        imagePayloads = await Promise.all(
            (input.imageUrls ?? []).slice(0, 4).map((url) => fetchImageAsDataUrl(url, input.origin))
        );
    }

    if (!imagePayloads.length) {
        return {
            extractedSpec: null,
            generatedDraft: null,
            meta: { confidence: null, notes: "No usable images provided" },
        };
    }

    const content: any[] = [
        { type: "input_text", text: buildPrompt(input) },
        ...imagePayloads.map((url) => ({
            type: "input_image",
            image_url: url,
        })),
    ];

    const response = await client.responses.create({
        model: process.env.OPENAI_ACQUISITION_MODEL || "gpt-4.1-mini",
        input: [{ role: "user", content }],
    });

    const text =
        (response as any).output_text ||
        (response as any).output?.[0]?.content?.[0]?.text ||
        "";

    const parsed = safeJsonParse<GenerateAcquisitionDraftResult>(text);

    if (!parsed) {
        return {
            extractedSpec: null,
            generatedDraft: null,
            meta: { confidence: null, notes: "AI returned non-JSON response", raw: text },
        };
    }

    return {
        extractedSpec: parsed.extractedSpec ?? null,
        generatedDraft: parsed.generatedDraft ?? null,
        meta: parsed.meta ?? null,
    };
}