function toAbsoluteUrl(input: string, origin: string) {
    if (!input) return "";
    if (/^https?:\/\//i.test(input) || input.startsWith("data:")) return input;
    if (input.startsWith("/")) return `${origin}${input}`;
    return `${origin}/${input.replace(/^\/+/, "")}`;
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