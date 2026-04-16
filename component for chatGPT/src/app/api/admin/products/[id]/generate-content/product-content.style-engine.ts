import type { GeneratedPayload } from "@/app/(admin)/admin/products/_server/ai/product-ai.type";

export type StyleEngineCheck = {
    score: number;
    genericHits: string[];
    bannedHits: string[];
    awkwardHits: string[];
    shouldRetry: boolean;
};

const BANNED_PATTERNS: Array<[RegExp, string]> = [
    [/\bấn tượng đầu tiên là[:,]?\b/gi, "ấn tượng đầu tiên là"],
    [/\bchiếc này rõ ràng hướng đến[:,]?\b/gi, "chiếc này rõ ràng hướng đến"],
    [/\bvề cảm giác sử dụng[:,]?\b/gi, "về cảm giác sử dụng"],
    [/\blựa chọn đáng cân nhắc\b/gi, "lựa chọn đáng cân nhắc"],
    [/\bphù hợp với nhiều đối tượng\b/gi, "phù hợp với nhiều đối tượng"],
    [/\bdễ phối mọi phong cách\b/gi, "dễ phối mọi phong cách"],
    [/\bhoàn hảo cho\b/gi, "hoàn hảo cho"],
];

const GENERIC_PATTERNS: Array<[RegExp, string]> = [
    [/\bmang lại cảm giác\b/gi, "mang lại cảm giác"],
    [/\btạo nên\b/gi, "tạo nên"],
    [/\bhướng đến\b/gi, "hướng đến"],
    [/\bgiữ trọn tinh thần\b/gi, "giữ trọn tinh thần"],
    [/\bđược thiết kế để\b/gi, "được thiết kế để"],
    [/\bđiểm nhấn chính\b/gi, "điểm nhấn chính"],
];

const AWKWARD_PATTERNS: Array<[RegExp, string]> = [
    [/\bcư xử đời thường\b/gi, "cư xử đời thường"],
    [/\bcó tỉ lệ cổ điển\b/gi, "có tỉ lệ cổ điển"],
    [/\bgom sáng\b/gi, "gom sáng"],
    [/\bkhuôn mặt dễ đọc\b/gi, "khuôn mặt dễ đọc"],
    [/\bbao dưỡng\b/gi, "bao dưỡng"],
];

function collectHits(text: string, patterns: Array<[RegExp, string]>) {
    const hits: string[] = [];
    for (const [regex, label] of patterns) {
        if (regex.test(text)) hits.push(label);
    }
    return hits;
}

function splitParagraphs(text: string) {
    return String(text)
        .split(/\n\s*\n/)
        .map((x) => x.trim())
        .filter(Boolean);
}

export function analyzeGeneratedPayload(payload: GeneratedPayload): StyleEngineCheck {
    const joined = [
        payload.promoteShort,
        payload.promoteLong,
        payload.facebookCaption,
        payload.instagramCaption,
    ]
        .filter(Boolean)
        .join("\n\n");

    const bannedHits = collectHits(joined, BANNED_PATTERNS);
    const genericHits = collectHits(joined, GENERIC_PATTERNS);
    const awkwardHits = collectHits(joined, AWKWARD_PATTERNS);

    const paragraphs = splitParagraphs(payload.promoteLong);
    const tooShort = payload.promoteLong.trim().length < 260;
    const weakParagraphs = paragraphs.length < 3;

    let score = 100;
    score -= bannedHits.length * 20;
    score -= genericHits.length * 8;
    score -= awkwardHits.length * 12;
    if (tooShort) score -= 12;
    if (weakParagraphs) score -= 10;

    const shouldRetry =
        bannedHits.length > 0 ||
        awkwardHits.length >= 2 ||
        genericHits.length >= 3 ||
        tooShort;

    return {
        score: Math.max(0, score),
        genericHits,
        bannedHits,
        awkwardHits,
        shouldRetry,
    };
}

function applyPhraseReplacements(text: string) {
    return String(text || "")
        .replace(/\bẤn tượng đầu tiên là[:,]?\s*/g, "")
        .replace(/\bấn tượng đầu tiên là[:,]?\s*/g, "")
        .replace(/\bChiếc này rõ ràng hướng đến[:,]?\s*/g, "")
        .replace(/\bchiếc này rõ ràng hướng đến[:,]?\s*/g, "")
        .replace(/\bVề cảm giác sử dụng[:,]?\s*/g, "")
        .replace(/\bvề cảm giác sử dụng[:,]?\s*/g, "")
        .replace(/\bmang lại cảm giác\b/gi, "cho cảm giác")
        .replace(/\btạo nên\b/gi, "gợi ra")
        .replace(/\bhướng đến\b/gi, "nghiêng về")
        .replace(/\bgiữ trọn tinh thần\b/gi, "giữ đúng tinh thần")
        .replace(/\bđược thiết kế để\b/gi, "được làm ra để")
        .replace(/\bcó tỉ lệ cổ điển\b/gi, "giữ đúng tỉ lệ cổ điển")
        .replace(/\bcư xử đời thường\b/gi, "dễ sống cùng hằng ngày")
        .replace(/\bgom sáng\b/gi, "giữ tổng thể gọn và tập trung")
        .replace(/\bkhuôn mặt dễ đọc\b/gi, "mặt số dễ đọc")
        .replace(/\blựa chọn đáng cân nhắc\b/gi, "kiểu đồng hồ đeo lâu sẽ thấy hợp")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/\s{2,}/g, " ")
        .trim();
}

export function hardenGeneratedPayload(payload: GeneratedPayload): GeneratedPayload {
    return {
        ...payload,
        promoteShort: applyPhraseReplacements(payload.promoteShort),
        promoteLong: applyPhraseReplacements(payload.promoteLong),
        facebookCaption: applyPhraseReplacements(payload.facebookCaption),
        instagramCaption: applyPhraseReplacements(payload.instagramCaption),
        specBullets: (payload.specBullets ?? []).map((x) =>
            String(x).replace(/^[•▪️\-\s]+/g, "").trim()
        ),
        titleOptions: (payload.titleOptions ?? []).map((x) =>
            String(x).replace(/^[•▪️\-\s]+/g, "").trim()
        ),
    };
}

export function buildRetryFeedback(check: StyleEngineCheck) {
    const notes: string[] = [];

    if (check.bannedHits.length) {
        notes.push(`Output đang chứa các cụm bị cấm: ${check.bannedHits.join(", ")}.`);
    }
    if (check.awkwardHits.length) {
        notes.push(`Output đang có các cụm gượng hoặc thiếu tự nhiên: ${check.awkwardHits.join(", ")}.`);
    }
    if (check.genericHits.length) {
        notes.push(`Output còn generic ở các cụm: ${check.genericHits.join(", ")}.`);
    }
    if (check.score < 80) {
        notes.push("Cần viết lại theo hướng tự nhiên hơn, có gu hơn, ít AI vibe hơn.");
    }

    return notes.join(" ");
}