export function cleanupText(text: any) {
    return String(text || "")
        .replace(/phù hợp nhiều đối tượng/gi, "")
        .replace(/dễ phối/gi, "")
        .trim();
}

export function cleanupGeneratedPayload(input: any) {
    return {
        specBullets: input?.specBullets ?? [],
        promoteShort: cleanupText(input?.promoteShort),
        promoteLong: cleanupText(input?.promoteLong),
        facebookCaption: cleanupText(input?.facebookCaption),
        instagramCaption: cleanupText(input?.instagramCaption),
        titleOptions: input?.titleOptions ?? [],
        hashtags: input?.hashtags ?? [],
        missingData: input?.missingData ?? [],
        safetyNotes: input?.safetyNotes ?? [],
    };
}

export function looksTooGeneric(payload: any) {
    return payload.promoteLong.length < 200;
}