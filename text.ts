import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
    const res = await client.responses.create({
        model: "gpt-5-mini",
        input: "Viết 1 câu về đồng hồ Omega vintage",
    });

    console.log(res.output_text);
}

test();