import { GetObjectCommand } from "@aws-sdk/client-s3";
import { normalizeKey } from "@/server/lib/product-image-storage";
import { s3, S3_BUCKET } from "@/server/s3";

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

export async function fetchImageAsDataUrl(imageUrl: string, origin: string) {
    const absoluteUrl = toAbsoluteUrl(imageUrl, origin);
    const res = await fetch(absoluteUrl);

    if (!res.ok) {
        throw new Error(`Không tải được ảnh: ${res.status}`);
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
}

export async function fetchImageEntryAsDataUrl(
    entry: { key?: string | null; url?: string | null },
    origin: string
) {
    const normalized = normalizeKey(entry?.key);

    if (normalized) {
        try {
            const obj = await s3.send(
                new GetObjectCommand({
                    Bucket: S3_BUCKET,
                    Key: normalized,
                })
            );

            if (!obj.Body) {
                throw new Error("S3 object body empty");
            }

            const contentType = obj.ContentType || "image/jpeg";
            const buffer = await streamToBuffer(obj.Body);
            return `data:${contentType};base64,${buffer.toString("base64")}`;
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

export async function callOpenAIJson<T>({
    apiKey,
    model,
    input,
    schema,
}: {
    apiKey: string;
    model: string;
    input: any;
    schema: { name: string; schema: any };
}): Promise<T> {
    const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model,
            input,
            text: {
                format: {
                    type: "json_schema",
                    name: schema.name,
                    strict: true,
                    schema: schema.schema,
                },
            },
        }),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(`OpenAI lỗi ${res.status}: ${JSON.stringify(json)}`);
    }

    const raw =
        json?.output?.flatMap((item: any) => item?.content || [])
            ?.find((c: any) => c?.type === "output_text")?.text || "";

    if (!raw) {
        throw new Error("OpenAI không trả về output_text.");
    }

    return JSON.parse(raw) as T;
}
