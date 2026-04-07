import { NextRequest, NextResponse } from 'next/server';

function toAbsoluteUrl(input: string, origin: string) {
    if (!input) return '';
    if (/^https?:\/\//i.test(input) || input.startsWith('data:')) return input;
    if (input.startsWith('/')) return `${origin}${input}`;
    return `${origin}/${input.replace(/^\/+/, '')}`;
}

export async function POST(req: NextRequest) {
    try {
        const { images } = await req.json();

        const rawUrl = images?.[0]?.url;
        if (!rawUrl) {
            return NextResponse.json({ error: 'No image' }, { status: 400 });
        }

        const imageUrl = toAbsoluteUrl(rawUrl, req.nextUrl.origin);

        const resImg = await fetch(imageUrl);
        if (!resImg.ok) {
            throw new Error(`Không tải được ảnh: ${resImg.status}`);
        }

        const contentType = resImg.headers.get('content-type') || 'image/jpeg';
        const buffer = await resImg.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');

        const response = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: process.env.OPENAI_PRODUCT_CONTENT_MODEL || 'gpt-5-mini',
                input: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'input_text',
                                text: `
Phân tích ảnh đồng hồ này và trả về JSON hợp lệ duy nhất với các keys:
brandName, ref, model, year, caseType, gender, movement, caliber, caseMaterial, goldKarat, goldColor, width, length, thickness, strap, glass, dialColor, dialCondition, boxIncluded, bookletIncluded, cardIncluded, confidenceNotes

Không bịa. Nếu không chắc thì để null hoặc chuỗi rỗng.
                `.trim(),
                            },
                            {
                                type: 'input_image',
                                image_url: `data:${contentType};base64,${base64}`,
                            },
                        ],
                    },
                ],
            }),
        });

        const json = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: `OpenAI lỗi: ${JSON.stringify(json)}` },
                { status: 500 }
            );
        }

        const text =
            json?.output?.flatMap((item: any) => item?.content || [])
                ?.find((c: any) => c?.type === 'output_text')
                ?.text || '{}';

        let spec: any = {};
        try {
            spec = JSON.parse(text);
        } catch {
            const start = text.indexOf('{');
            const end = text.lastIndexOf('}');
            if (start !== -1 && end !== -1 && end > start) {
                spec = JSON.parse(text.slice(start, end + 1));
            }
        }

        return NextResponse.json({ spec });
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message || 'Spec extract failed' },
            { status: 500 }
        );
    }
}