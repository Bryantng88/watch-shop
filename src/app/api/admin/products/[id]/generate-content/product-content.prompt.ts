export function buildMainPrompt(input: any) {
    const meta = input.promptMeta ?? {};

    const blocks: any[] = [
        {
            role: "developer",
            content: [
                {
                    type: "input_text",
                    text: `
  Bạn là copywriter đồng hồ vintage cao cấp.
  
  - Không viết generic
  - Không dịch máy
  - Viết như người bán thật có gu
  - Câu ngắn, nhịp rõ
  - Có punchline tinh tế
            `.trim(),
                },
            ],
        },
        {
            role: "user",
            content: [
                {
                    type: "input_text",
                    text: `
  FACTS:
  ${JSON.stringify(input.facts, null, 2)}
  
  MISSING:
  ${JSON.stringify(input.missingData, null, 2)}
  
  META:
  ${JSON.stringify(meta, null, 2)}
  
  YÊU CẦU:
  - 3–4 đoạn
  - mỗi đoạn 2–3 câu
  - có opening + insight + wearability
  - không liệt kê spec
            `.trim(),
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