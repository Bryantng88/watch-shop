import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { watchSpec, promptHint, toneSample } = await req.json();

        const prompt = `
Bạn là chuyên gia viết content đồng hồ vintage.

FACT:
${JSON.stringify(watchSpec, null, 2)}

HINT:
${promptHint}

STYLE:
${toneSample}

Trả về JSON:
{
  "specBullets": [],
  "promoteShort": "",
  "promoteLong": "",
  "facebookCaption": "",
  "instagramCaption": "",
  "titleOptions": [],
  "hashtags": []
}
`;

        const res = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-5-mini',
                input: prompt,
            }),
        });

        const json = await res.json();

        const text =
            json.output?.[0]?.content?.find((c: any) => c.type === 'output_text')?.text || '{}';

        return NextResponse.json({
            generated: JSON.parse(text),
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}