export type QuickWatchDraftRuleInput = {
    quickInput?: string;
    aiHint?: string;
    imageKey?: string | null;
    imageUrl?: string | null;
    receiveService?: boolean;
};

export function buildQuickWatchDraftMeta(input: QuickWatchDraftRuleInput) {
    return {
        title: String(input.quickInput ?? "").trim(),
        watchFlags: {
            needService: Boolean(input.receiveService ?? true),
        },
        aiMeta: {
            images:
                input.imageKey || input.imageUrl
                    ? [
                        {
                            key: input.imageKey ?? null,
                            url: input.imageUrl ?? null,
                        },
                    ]
                    : [],
            aiHint: String(input.aiHint ?? "").trim() || null,
        },
    };
}