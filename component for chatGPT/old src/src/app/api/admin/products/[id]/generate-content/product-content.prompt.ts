import { GeneratedPayload } from "@/app/(admin)/admin/products/_server/product-ai.type";

const SYSTEM_PROMPT = `
Bạn là người bán đồng hồ vintage/pre-owned cao cấp tại Việt Nam, có gu rõ ràng.

Cách viết:
- Viết như đang nói với người mua thật, không phải viết bài marketing.
- Không dùng văn phong brochure, không viết như AI mô tả sản phẩm.
- Tránh câu khuôn mẫu.

TUYỆT ĐỐI TRÁNH:
- “Ấn tượng đầu tiên là…”
- “Chiếc này hướng đến…”
- “Thiết kế … là điểm nhấn”
- “Về cảm giác sử dụng…”
- “lựa chọn đáng cân nhắc”
- “phù hợp với nhiều đối tượng”
- “dễ phối đồ”
- “hoàn hảo cho…”

THAY VÀO ĐÓ:
- Viết ngắn, câu rõ.
- Mỗi đoạn 1 ý.
- Có nhận định cá nhân (subtle judgement).
- Có câu “có gu” – đọc vào biết người viết có quan điểm.

VỀ NỘI DUNG:
- Không bịa dữ kiện.
- Không dùng claim như “zin”, “NOS”, “nguyên bản”, “hiếm” nếu không có data.
- Nếu có ảnh: ưu tiên mô tả những gì nhìn thấy (dial, ánh sáng, texture, tỷ lệ, vibe).
- Không suy diễn quá xa từ ảnh.

STRUCTURE (bắt buộc):
- 3 hoặc 4 đoạn
- mỗi đoạn 2–3 câu
- đoạn 1: opening hook (cảm nhận tổng thể)
- đoạn 2: design insight (dial / case / layout)
- đoạn 3: wearability (đeo, cảm giác, use case)
- optional đoạn 4: một nhận định mang tính “gu” (rất quan trọng)

STYLE:
- Câu không quá 25 từ
- Ưu tiên câu ngắn
- Tránh câu “đúng nhưng không ai nói vậy”
- Nếu câu nghe như dịch từ tiếng Anh → viết lại

ENDING RULE:
- Không kết bằng câu generic kiểu “đáng cân nhắc”
- Kết bằng một nhận định nhẹ, có gu

OUTPUT:
- JSON đúng schema
`;
type PromptMetaInput = {
    narrative?: string;
    audience?: string;
    structure?: string;
    tonePreset?: string;
    focusPoints?: string[];
    customBrief?: string;
    bannedPhrases?: string;
    referenceSample?: string;
    forceSections?: string[];
};
export function buildMainPrompt(input: any) {
    const meta = input.promptMeta ?? {};

    const blocks: any[] = [
        {
            role: "developer",
            content: [
                {
                    type: "input_text",
                    text: SYSTEM_PROMPT
                },
            ],
        },
        {
            role: "user",
            content: [
                {
                    type: "input_text",
                    text: buildUserPrompt({
                        title: input.title,
                        brandName: input.brandName,
                        categoryName: input.categoryName,
                        facts: input.facts,
                        missingData: input.missingData,
                        promptMeta: input.promptMeta,
                    }),
                },
            ],
        },
    ];

    if (input.imageDataUrls?.length) {
        input.imageDataUrls.forEach((url: string) => {
            blocks[1].content.push({
                type: "input_image",
                image_url: url,
            });
        });
    }

    return blocks;
}

function buildUserPrompt(input: {
    title?: string | null;
    brandName?: string | null;
    categoryName?: string | null;
    facts: any;
    missingData: string[];
    promptMeta?: PromptMetaInput | null;
}) {
    const meta = input.promptMeta ?? {};

    return `
MỤC TIÊU:
Viết nội dung bán đồng hồ từ dữ liệu có sẵn + ảnh (nếu có).

THÔNG TIN:
- Title: ${input.title || "Không có"}
- Brand: ${input.brandName || "Không có"}
- Category: ${input.categoryName || "Không có"}

FACTS:
${JSON.stringify(input.facts, null, 2)}

MISSING DATA:
${JSON.stringify(input.missingData, null, 2)}

ĐỊNH HƯỚNG:
- Narrative: ${meta.narrative || "balanced"}
- Audience: ${meta.audience || "daily"}
- Tone: ${meta.tonePreset || "balanced"}
- Focus: ${(meta.focusPoints || []).join(", ") || "balanced"}

BRIEF:
${meta.customBrief || "Không có"}

PHRASE CẦN TRÁNH:
${meta.bannedPhrases || "Không có"}

MẪU VĂN PHONG:
${meta.referenceSample || "Không có"}

YÊU CẦU QUAN TRỌNG:
- Không viết như AI mô tả sản phẩm
- Không liệt kê spec
- Phải có nhận định cá nhân
- Phải có câu “có gu”

PROMOTE LONG:
- 3 đoạn (tối đa 4)
- mỗi đoạn 2–3 câu
- không đoạn nào chỉ mô tả, phải có nhận định

Nếu thiếu dữ liệu:
→ chỉ nhắc 1 câu ngắn ở cuối

Trả về JSON đúng schema.
    `.trim();
}
export function buildRefinePrompt(input: any) {
    return [
        {
            role: "developer",
            content: [
                {
                    type: "input_text",
                    text: `
  Bạn là editor refine nội dung.
  
  - làm mượt
  - giảm AI vibe
  - giữ nguyên ý
            `,
                },
            ],
        },
        {
            role: "user",
            content: [
                {
                    type: "input_text",
                    text: `
  Rewrite nội dung này:
  
  ${JSON.stringify(input.original, null, 2)}
            `,
                },
            ],
        },
    ];
}

export function buildStyleRetryPrompt(input: {
    original: GeneratedPayload;
    feedback: string;
    promptMeta?: any;
}) {
    const meta = input.promptMeta ?? {};

    return [
        {
            role: "developer",
            content: [
                {
                    type: "input_text",
                    text: [
                        "Bạn là editor chuyên sửa nội dung đồng hồ vintage để đạt giọng người bán thật.",
                        "Nhiệm vụ: viết lại output để bỏ mùi AI, bỏ câu generic, bỏ cụm gượng.",
                        "Không thêm dữ kiện mới.",
                        "Không đổi meaning.",
                        "Giữ structure gần như nguyên bản.",
                    ].join(" "),
                },
            ],
        },
        {
            role: "user",
            content: [
                {
                    type: "input_text",
                    text: `
Hãy viết lại output dưới đây.

FEEDBACK BẮT BUỘC:
${input.feedback}

PROMPT META:
- Narrative: ${meta.narrative || ""}
- Audience: ${meta.audience || ""}
- Tone: ${meta.tonePreset || ""}

OUTPUT CŨ:
${JSON.stringify(input.original, null, 2)}

YÊU CẦU:
- Tự nhiên hơn
- Có gu hơn
- Không còn các phrase bị cấm
- Không còn câu “đúng nhưng không ai nói vậy”

Trả về JSON đúng schema.
                    `.trim(),
                },
            ],
        },
    ];
}