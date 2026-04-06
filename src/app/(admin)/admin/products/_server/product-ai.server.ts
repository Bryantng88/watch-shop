import type {
    GeneratedPayload,
    ProductAiDraft,
    ProductAiMeta,
    AiTonePreset,
    SpecExtractedPayload,
} from './product-ai.types';

function text(v: any) {
    if (v == null) return '';
    return String(v).trim();
}

function nullableText(v: any) {
    const s = text(v);
    return s || null;
}

function num(v: any) {
    if (v == null || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

function boolOrNull(v: any) {
    return typeof v === 'boolean' ? v : null;
}

export function mergeProductWithDraft(product: any, draft: ProductAiDraft | null | undefined) {
    if (!draft) return product;

    return {
        ...product,
        title: draft.title ?? product.title,
        description: draft.description ?? product.description,
        aiPromptHint: draft.aiPromptHint ?? product.aiPromptHint ?? null,
        aiToneSample: draft.aiToneSample ?? product.aiToneSample ?? null,
        aiTonePreset: draft.aiTonePreset ?? product.aiTonePreset ?? null,
        aiFocusPoints: Array.isArray(draft.aiFocusPoints) ? draft.aiFocusPoints : product.aiFocusPoints ?? [],
        brand:
            draft.brandName || draft.brandId
                ? {
                    ...(product.brand ?? {}),
                    id: draft.brandId ?? product.brand?.id ?? null,
                    name: draft.brandName ?? product.brand?.name ?? null,
                }
                : product.brand,
        ProductCategory:
            draft.categoryName || draft.categoryId
                ? {
                    ...(product.ProductCategory ?? {}),
                    id: draft.categoryId ?? product.ProductCategory?.id ?? null,
                    name: draft.categoryName ?? product.ProductCategory?.name ?? null,
                }
                : product.ProductCategory,
        image: Array.isArray(draft.image)
            ? draft.image
            : Array.isArray(draft.images)
                ? draft.images
                : product.image,
        images: Array.isArray(draft.images)
            ? draft.images
            : Array.isArray(draft.image)
                ? draft.image
                : product.images,
        watchSpec: {
            ...(product.watchSpec ?? {}),
            ...(draft.watchSpec ?? {}),
        },
    };
}

export function getImageUrls(product: any) {
    const sources = [...(product?.images ?? []), ...(product?.image ?? [])];
    const urls = sources
        .map((item: any) => text(item?.url))
        .filter(Boolean)
        .filter((url: string, idx: number, arr: string[]) => arr.indexOf(url) === idx);

    return urls.slice(0, 4);
}

export function buildFacts(product: any) {
    const ws = product?.watchSpec ?? {};
    const brand = text(product?.brand?.name);
    const model = text(ws?.model);
    const title = text(product?.title);
    const ref = text(ws?.ref);
    const year = text(ws?.year);
    const movement = text(ws?.movement).toUpperCase();
    const caseType = text(ws?.caseType).toUpperCase();
    const caseMaterial = text(ws?.caseMaterial).toUpperCase();
    const width = num(ws?.width);
    const thickness = num(ws?.thickness);
    const glass = text(ws?.glass).toUpperCase();
    const dialColor = text(ws?.dialColor);
    const dialCondition = text(ws?.dialCondition);
    const strap = text(ws?.strap).toUpperCase();
    const gender = text(ws?.gender).toUpperCase();
    const category = text(product?.ProductCategory?.name);
    const aiPromptHint = text(product?.aiPromptHint);
    const aiToneSample = text(product?.aiToneSample);
    const aiTonePreset = text(product?.aiTonePreset).toLowerCase() as AiTonePreset | '';
    const aiFocusPoints = Array.isArray(product?.aiFocusPoints)
        ? product.aiFocusPoints.map((x: any) => text(x)).filter(Boolean)
        : [];

    const missingData: string[] = [];
    if (!brand) missingData.push('brand');
    if (!movement) missingData.push('movement');
    if (!width) missingData.push('case size');
    if (!dialColor) missingData.push('dial color');

    const movementText =
        movement === 'QUARTZ'
            ? 'máy pin'
            : movement === 'AUTOMATIC'
                ? 'máy automatic'
                : movement === 'MANUAL'
                    ? 'máy lên dây'
                    : movement
                        ? movement.toLowerCase()
                        : 'bộ máy';

    const movementCharm =
        movement === 'QUARTZ'
            ? 'ổn định cao, tiện đeo hàng ngày'
            : movement === 'AUTOMATIC'
                ? 'kim giây trôi mượt đặc trưng'
                : movement === 'MANUAL'
                    ? 'trải nghiệm cơ khí thú vị và có chiều sâu'
                    : 'vận hành đúng tinh thần đồng hồ cổ';

    const sizeText =
        width == null
            ? ''
            : width <= 35
                ? `${width}mm – size cổ điển, đeo gọn tay`
                : width <= 37
                    ? `${width}mm – size cân đối, lên tay thanh lịch`
                    : `${width}mm – size hiện đại hơn, đeo đầm tay`;

    const caseShapeText =
        caseType === 'ROUND'
            ? 'dáng tròn cổ điển'
            : caseType === 'TANK'
                ? 'phom tank thanh lịch'
                : caseType === 'CUSHION'
                    ? 'form cushion cá tính'
                    : caseType
                        ? `dáng ${caseType.toLowerCase()}`
                        : 'form vỏ hài hòa';

    return {
        brand,
        model,
        title,
        ref,
        year,
        movement,
        movementText,
        movementCharm,
        caseType,
        caseShapeText,
        caseMaterial,
        width,
        thickness,
        glass,
        dialColor,
        dialCondition,
        strap,
        gender,
        category,
        aiPromptHint,
        aiToneSample,
        aiTonePreset,
        aiFocusPoints,
        missingData,
        boxIncluded: !!ws?.boxIncluded,
        bookletIncluded: !!ws?.bookletIncluded,
        cardIncluded: !!ws?.cardIncluded,
    };
}

export function buildRuleBasedContent(product: any): GeneratedPayload {
    const facts = buildFacts(product);
    const specBullets: string[] = [];
    const titles = [
        [
            facts.brand,
            facts.model,
            facts.movement === 'QUARTZ' ? 'pin' : facts.movementText.replace('máy ', ''),
            facts.dialColor ? `mặt ${facts.dialColor}` : '',
        ]
            .filter(Boolean)
            .join(' ')
            .trim(),
        [facts.brand, facts.model, facts.year].filter(Boolean).join(' ').trim(),
    ].filter(Boolean);

    if (facts.width) specBullets.push(`▪️Case size: ${facts.sizeText}`);
    if (facts.movementText)
        specBullets.push(
            `▪️Movement: ${facts.movementText}${facts.brand ? ` ${facts.brand}` : ''} · ${facts.movementCharm}`
        );
    if (facts.dialColor)
        specBullets.push(`▪️Dial ${facts.dialColor}${facts.dialCondition ? ` condition ${facts.dialCondition}` : ''}`);
    if (facts.caseMaterial || facts.caseShapeText) {
        specBullets.push(
            `▪️${[facts.caseShapeText, facts.caseMaterial ? `vỏ ${facts.caseMaterial.toLowerCase()}` : ''].filter(Boolean).join(' · ')}`
        );
    }
    if (facts.glass) specBullets.push(`▪️Kính ${facts.glass.toLowerCase()}`);
    if (facts.model) specBullets.push(`▪️Dòng ${facts.model} mang tổng thể thanh lịch, dễ đeo hàng ngày`);

    const kit: string[] = [];
    if (facts.boxIncluded) kit.push('hộp');
    if (facts.bookletIncluded) kit.push('sổ');
    if (facts.cardIncluded) kit.push('thẻ');
    if (kit.length) specBullets.push(`▪️Phụ kiện đi kèm: ${kit.join(', ')}`);

    const intro = `${facts.brand || 'Mẫu đồng hồ này'}${facts.model ? ` ${facts.model}` : ''} mang tinh thần vintage rất rõ, phù hợp với người thích một chiếc đồng hồ gọn gàng và có cá tính riêng.`;
    const visual = facts.dialColor
        ? `Dial ${facts.dialColor}${facts.caseMaterial ? ` đi cùng vỏ ${facts.caseMaterial.toLowerCase()}` : ''} tạo nên tổng thể hài hòa và dễ đeo.`
        : `Tổng thể mặt số và vỏ cho cảm giác cân đối, đúng chất một chiếc dress watch vintage dễ chơi.`;
    const movement = facts.movementText
        ? `Bên trong là ${facts.movementText}${facts.brand ? ` ${facts.brand}` : ''}, ${facts.movementCharm}.`
        : 'Bên trong là bộ máy vận hành ổn định, phù hợp cho nhu cầu đeo hàng ngày.';
    const size = facts.width ? `Case ${facts.sizeText}, rất hợp cho cổ tay châu Á.` : 'Form lên tay cân đối và thanh lịch.';

    return {
        specBullets,
        promoteShort: [intro, movement].join(' '),
        promoteLong: [intro, visual, movement, size].join('\n\n'),
        facebookCaption: [intro, visual, movement, size, ...specBullets].join('\n\n'),
        instagramCaption: [intro, visual, size, facts.brand ? `#${facts.brand.replace(/\s+/g, '')}` : '#vintagewatch', '#watchvintage'].filter(Boolean).join('\n\n'),
        titleOptions: titles,
        hashtags: [facts.brand ? `#${facts.brand.replace(/\s+/g, '')}` : null, facts.model ? `#${facts.model.replace(/\s+/g, '')}` : null, '#vintagewatch', '#watchcollector'].filter(Boolean) as string[],
        missingData: facts.missingData,
        safetyNotes: [
            'Không tự khẳng định đồng hồ đã được lau dầu / serviced nếu chưa xác nhận kỹ thuật.',
            'Không dùng các claim như zin, NOS, nguyên bản, hiếm nếu chưa có cờ xác nhận trong dữ liệu.',
        ],
    };
}

function toneInstruction(preset: AiTonePreset | '' | null | undefined) {
    switch (preset) {
        case 'elegant':
            return 'Văn phong tinh tế, sang, tối giản, thiên về dress watch.';
        case 'collector':
            return 'Văn phong của người chơi vintage, có chiều sâu, nhấn tính sưu tầm.';
        case 'sales':
            return 'Văn phong bán hàng rõ ràng hơn, vẫn lịch sự và không phô trương quá đà.';
        case 'listing':
            return 'Văn phong trung tính, gọn, dễ đọc, hợp đăng listing và sản phẩm.';
        default:
            return 'Văn phong cân bằng, đúng chất người bán đồng hồ thật, không khoa trương.';
    }
}

function extractResponseText(data: any) {
    if (typeof data?.output_text === 'string' && data.output_text.trim()) {
        return data.output_text.trim();
    }

    const texts: string[] = [];
    for (const item of data?.output ?? []) {
        if (item?.type !== 'message') continue;
        for (const part of item?.content ?? []) {
            if (part?.type === 'output_text' && typeof part?.text === 'string') {
                texts.push(part.text);
            }
        }
    }

    return texts.join('\n').trim();
}

function extractJson(textContent: string) {
    const cleaned = textContent.trim();
    if (cleaned.startsWith('{') || cleaned.startsWith('[')) return JSON.parse(cleaned);
    const fenced = cleaned.match(/```json\s*([\s\S]*?)```/i) || cleaned.match(/```([\s\S]*?)```/);
    if (fenced?.[1]) return JSON.parse(fenced[1].trim());
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) throw new Error('OpenAI trả về không phải JSON hợp lệ.');
    return JSON.parse(cleaned.slice(start, end + 1));
}

async function callOpenAI(payload: any) {
    const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(payload),
    });

    const json = await response.json().catch(() => null);

    if (!response.ok) {
        const err = typeof json === 'object' && json ? JSON.stringify(json) : response.statusText;
        throw new Error(`OpenAI lỗi ${response.status}: ${err}`);
    }

    const textContent = extractResponseText(json);
    if (!textContent) throw new Error('OpenAI có trả response nhưng không extract được text');
    return { raw: json, text: textContent };
}

export async function enhanceWithOpenAI(rule: GeneratedPayload, product: any): Promise<{ generated: GeneratedPayload; meta: ProductAiMeta }> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return { generated: rule, meta: { mode: 'rule', model: null, message: 'Thiếu OPENAI_API_KEY' } };
    }

    const model = process.env.OPENAI_PRODUCT_CONTENT_MODEL || 'gpt-5-mini';
    const facts = buildFacts(product);
    const imageUrls = getImageUrls(product);

    const prompt = [
        'Bạn là copywriter chuyên viết nội dung cho đồng hồ vintage cao cấp tại thị trường Việt Nam.',
        toneInstruction(facts.aiTonePreset),
        'Ràng buộc:',
        '- Không bịa dữ kiện.',
        '- Không dùng claim zin, NOS, nguyên bản, hiếm, serviced nếu facts chưa xác nhận.',
        '- Viết tiếng Việt tự nhiên, có chiều sâu, không sáo rỗng.',
        facts.aiPromptHint ? `Gợi ý thêm từ người dùng: ${facts.aiPromptHint}` : null,
        facts.aiFocusPoints.length ? `Điểm cần nhấn: ${facts.aiFocusPoints.join(', ')}` : null,
        facts.aiToneSample ? `Mẫu văn phong tham chiếu:\n${facts.aiToneSample}` : null,
        `FACTS:\n${JSON.stringify(facts, null, 2)}`,
        `RULE_BASED_DRAFT:\n${JSON.stringify(rule, null, 2)}`,
        imageUrls.length ? `Bạn còn nhận thêm ${imageUrls.length} ảnh sản phẩm để nhìn tổng thể dial, form vỏ và cảm giác thẩm mỹ. Chỉ dùng ảnh để hỗ trợ diễn đạt, không bịa các thông tin kỹ thuật không chắc chắn.` : null,
        'Trả về JSON hợp lệ duy nhất với các keys: specBullets, promoteShort, promoteLong, facebookCaption, instagramCaption, titleOptions, hashtags, missingData, safetyNotes.',
    ]
        .filter(Boolean)
        .join('\n\n');

    const inputContent: any[] = [{ type: 'input_text', text: prompt }];
    for (const imageUrl of imageUrls) {
        inputContent.push({ type: 'input_image', image_url: imageUrl, detail: 'high' });
    }

    try {
        const { text: responseText } = await callOpenAI({
            model,
            input: [{ role: 'user', content: inputContent }],
            temperature: 0.7,
            max_output_tokens: 1400,
            text: { format: { type: 'text' } },
        });

        const parsed = extractJson(responseText);
        const generated: GeneratedPayload = {
            specBullets: Array.isArray(parsed?.specBullets) ? parsed.specBullets.filter(Boolean) : rule.specBullets,
            promoteShort: text(parsed?.promoteShort) || rule.promoteShort,
            promoteLong: text(parsed?.promoteLong) || rule.promoteLong,
            facebookCaption: text(parsed?.facebookCaption) || rule.facebookCaption,
            instagramCaption: text(parsed?.instagramCaption) || rule.instagramCaption,
            titleOptions: Array.isArray(parsed?.titleOptions) ? parsed.titleOptions.filter(Boolean) : rule.titleOptions,
            hashtags: Array.isArray(parsed?.hashtags) ? parsed.hashtags.filter(Boolean) : rule.hashtags,
            missingData: Array.isArray(parsed?.missingData) ? parsed.missingData.filter(Boolean) : rule.missingData,
            safetyNotes: Array.isArray(parsed?.safetyNotes) ? parsed.safetyNotes.filter(Boolean) : rule.safetyNotes,
        };

        return { generated, meta: { mode: 'openai', model, message: null } };
    } catch (error: any) {
        return { generated: rule, meta: { mode: 'rule', model, message: error?.message ?? 'OpenAI fallback' } };
    }
}

export async function extractSpecsFromImages(product: any): Promise<{ extracted: SpecExtractedPayload | null; meta: ProductAiMeta }> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return { extracted: null, meta: { mode: 'rule', model: null, message: 'Thiếu OPENAI_API_KEY' } };
    }

    const model = process.env.OPENAI_PRODUCT_CONTENT_VISION_MODEL || process.env.OPENAI_PRODUCT_CONTENT_MODEL || 'gpt-5-mini';
    const imageUrls = getImageUrls(product);
    if (!imageUrls.length) {
        return { extracted: null, meta: { mode: 'rule', model, message: 'Chưa có ảnh sản phẩm để phân tích.' } };
    }

    const facts = buildFacts(product);
    const schemaDescription = {
        brandName: 'string|null',
        ref: 'string|null',
        model: 'string|null',
        year: 'string|null',
        caseType: 'ROUND|TANK|CUSHION|string|null',
        gender: 'MEN|WOMEN|UNISEX|string|null',
        movement: 'QUARTZ|AUTOMATIC|MANUAL|string|null',
        caliber: 'string|null',
        caseMaterial: 'STAINLESS_STEEL|GOLD|GOLD_PLATED|string|null',
        goldKarat: 'number|null',
        goldColor: 'YELLOW|ROSE|WHITE|string|null',
        width: 'number|null',
        length: 'number|null',
        thickness: 'number|null',
        strap: 'LEATHER|BRACELET|RUBBER|string|null',
        glass: 'MINERAL|SAPPHIRE|ACRYLIC|string|null',
        dialColor: 'string|null',
        dialCondition: 'string|null',
        boxIncluded: 'boolean|null',
        bookletIncluded: 'boolean|null',
        cardIncluded: 'boolean|null',
        confidenceNotes: 'string[]',
        warnings: 'string[]',
        rawVisualNotes: 'string',
    };

    const prompt = [
        'Bạn là chuyên gia nhận diện đồng hồ từ ảnh cho hệ thống quản trị sản phẩm.',
        'Mục tiêu: suy luận thận trọng từ ảnh để điền spec ban đầu. Không bịa khi ảnh không đủ rõ.',
        'Nếu không chắc thì trả null và ghi chú trong warnings hoặc confidenceNotes.',
        'Chỉ trả về JSON hợp lệ duy nhất, không markdown.',
        `Schema mong muốn: ${JSON.stringify(schemaDescription, null, 2)}`,
        `Dữ liệu hiện có để tham chiếu thêm (nếu đã nhập): ${JSON.stringify(facts, null, 2)}`,
    ].join('\n\n');

    const inputContent: any[] = [{ type: 'input_text', text: prompt }];
    for (const imageUrl of imageUrls) {
        inputContent.push({ type: 'input_image', image_url: imageUrl, detail: 'high' });
    }

    try {
        const { text: responseText } = await callOpenAI({
            model,
            input: [{ role: 'user', content: inputContent }],
            temperature: 0.2,
            max_output_tokens: 1200,
            text: { format: { type: 'text' } },
        });

        const parsed = extractJson(responseText);
        const extracted: SpecExtractedPayload = {
            brandName: nullableText(parsed?.brandName),
            ref: nullableText(parsed?.ref),
            model: nullableText(parsed?.model),
            year: nullableText(parsed?.year),
            caseType: nullableText(parsed?.caseType),
            gender: nullableText(parsed?.gender),
            movement: nullableText(parsed?.movement),
            caliber: nullableText(parsed?.caliber),
            caseMaterial: nullableText(parsed?.caseMaterial),
            goldKarat: num(parsed?.goldKarat),
            goldColor: nullableText(parsed?.goldColor),
            width: num(parsed?.width),
            length: num(parsed?.length),
            thickness: num(parsed?.thickness),
            strap: nullableText(parsed?.strap),
            glass: nullableText(parsed?.glass),
            dialColor: nullableText(parsed?.dialColor),
            dialCondition: nullableText(parsed?.dialCondition),
            boxIncluded: boolOrNull(parsed?.boxIncluded),
            bookletIncluded: boolOrNull(parsed?.bookletIncluded),
            cardIncluded: boolOrNull(parsed?.cardIncluded),
            confidenceNotes: Array.isArray(parsed?.confidenceNotes) ? parsed.confidenceNotes.filter(Boolean) : [],
            warnings: Array.isArray(parsed?.warnings) ? parsed.warnings.filter(Boolean) : [],
            rawVisualNotes: text(parsed?.rawVisualNotes),
        };

        return { extracted, meta: { mode: 'openai', model, message: null } };
    } catch (error: any) {
        return { extracted: null, meta: { mode: 'rule', model, message: error?.message ?? 'Vision fallback' } };
    }
}
