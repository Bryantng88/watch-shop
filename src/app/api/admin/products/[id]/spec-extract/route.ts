import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { images } = await req.json();

        const url = images?.[0]?.url;
        if (!url) throw new Error('No image');

        const resImg = await fetch(url);
        const buffer = await resImg.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');

        const response = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-5-mini',
                input: [
                    {
                        role: 'user',
                        content: [
                            { type: 'input_text', text: 'Extract watch specs JSON' },
                            {
                                type: 'input_image',
                                image_url: `data:image/jpeg;base64,${base64}`,
                            },
                        ],
                    },
                ],
            }),
        });

        const json = await response.json();

        const text =
            json.output?.[0]?.content?.find((c: any) => c.type === 'output_text')?.text || '{}';

        return NextResponse.json({
            spec: JSON.parse(text),
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}