import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export type GenerateAcquisitionSpecInput = {
    title?: string | null;
    brand?: string | null;
    model?: string | null;
    notes?: string | null;
    condition?: string | null;
    images?: string[];
};

export type GenerateAcquisitionSpecResult = {
    extractedSpec?: {
        brandName?: string | null;
        modelFamily?: string | null;
        bestRefCandidate?: string | null;
        bestCaliberCandidate?: string | null;
        yearEstimate?: string | null;
        movement?: string | null;
        caseType?: string | null;
        caseMaterial?: string | null;
        dialColor?: string | null;
        glass?: string | null;
        widthEstimateMm?: number | null;
        probableVisualFacts?: {
            probableBrand?: string | null;
            movement?: string | null;
            caseType?: string | null;
            caseMaterial?: string | null;
            dialColor?: string | null;
            glass?: string | null;
            widthEstimateMm?: number | null;
        } | null;
        confirmedFacts?: {
            brandName?: string | null;
        } | null;
        suggestedFacts?: {
            probableBrand?: string | null;
        } | null;
    };
    summary?: string | null;
};

type ResponseContentItem =
    | { type: "input_text"; text: string }
    | { type: "input_image"; image_url: string };

function buildPrompt(input: GenerateAcquisitionSpecInput) {
    return `
Bạn là chuyên gia nhận diện đồng hồ vintage/luxury từ ảnh và dữ liệu nhập kho.

Nhiệm vụ:
- suy luận cẩn thận, ưu tiên độ chính xác
- nếu không chắc thì trả null
- chỉ trả JSON hợp lệ, không markdown, không giải thích thêm

Schema JSON:
{
  "extractedSpec": {
    "brandName": "string | null",
    "modelFamily": "string | null",
    "bestRefCandidate": "string | null",
    "bestCaliberCandidate": "string | null",
    "yearEstimate": "string | null",
    "movement": "string | null",
    "caseType": "string | null",
    "caseMaterial": "string | null",
    "dialColor": "string | null",
    "glass": "string | null",
    "widthEstimateMm": "number | null",
    "probableVisualFacts": {
      "probableBrand": "string | null",
      "movement": "string | null",
      "caseType": "string | null",
      "caseMaterial": "string | null",
      "dialColor": "string | null",
      "glass": "string | null",
      "widthEstimateMm": "number | null"
    },
    "confirmedFacts": {
      "brandName": "string | null"
    },
    "suggestedFacts": {
      "probableBrand": "string | null"
    }
  },
  "summary": "string | null"
}

Thông tin đầu vào:
- title: ${input.title ?? ""}
- brand: ${input.brand ?? ""}
- model: ${input.model ?? ""}
- notes: ${input.notes ?? ""}
- condition: ${input.condition ?? ""}
`.trim();
}

function safeParseJson(text: string): GenerateAcquisitionSpecResult {
    try {
        return JSON.parse(text) as GenerateAcquisitionSpecResult;
    } catch {
        return {};
    }
}

export async function generateAcquisitionSpec(
    input: GenerateAcquisitionSpecInput
): Promise<GenerateAcquisitionSpecResult> {
    const images = (input.images ?? []).filter(
        (x): x is string => typeof x === "string" && x.trim().length > 0
    );
    const res = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: [
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: buildPrompt(input),
                    },
                    ...images.map((url) => ({
                        type: "input_image" as const,
                        image_url: url,
                        detail: "auto" as const,
                    })),
                ],
            },
        ],
    });

    const text = res.output_text?.trim() || "{}";
    return safeParseJson(text);
}