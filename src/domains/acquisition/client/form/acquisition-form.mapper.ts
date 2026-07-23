import type {
    AcquisitionPreparedImage,
    AcquisitionWatchLine,
} from "./acquisition-form.types";

function uid() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2, 10);
}

export function createEmptyWatchLine(
    audienceSegment: "MEN" | "WOMEN" = "MEN",
): AcquisitionWatchLine {
    return {
        id: uid(),
        audienceSegment,
        quickInput: "",
        aiHint: "",
        cost: "",
        salePrice: "",
        imageKey: null,
        imageUrl: null,
    };
}

export function createWatchLineFromPreparedImage(
    image: AcquisitionPreparedImage,
    audienceSegment: "MEN" | "WOMEN" = "MEN",
): AcquisitionWatchLine {
    return {
        id: uid(),
        audienceSegment,
        quickInput: "",
        aiHint: "",
        cost: "",
        salePrice: "",
        imageKey: image.key ?? null,
        imageUrl: image.url ?? null,
    };
}

export function hasImage(line: AcquisitionWatchLine) {
    return Boolean(
        String(line.imageKey ?? "").trim() || String(line.imageUrl ?? "").trim()
    );
}

export function isBlankWatchLine(line: AcquisitionWatchLine) {
    return (
        !line.quickInput?.trim() &&
        !line.aiHint?.trim() &&
        (line.cost === "" || Number(line.cost || 0) === 0) &&
        (line.salePrice === "" || Number(line.salePrice || 0) === 0) &&
        !line.imageKey &&
        !line.imageUrl
    );
}

export function applyPreparedImagesTopDown(
    lines: AcquisitionWatchLine[],
    images: AcquisitionPreparedImage[],
    audienceSegment: "MEN" | "WOMEN" = "MEN",
): AcquisitionWatchLine[] {
    if (!images.length) return lines;

    const next = [...lines];
    let imageIndex = 0;

    for (let i = 0; i < next.length && imageIndex < images.length; i += 1) {
        if (hasImage(next[i])) continue;

        const image = images[imageIndex];
        next[i] = {
            ...next[i],
            imageKey: image.key ?? null,
            imageUrl: image.url ?? null,
        };
        imageIndex += 1;
    }

    while (imageIndex < images.length) {
        next.push(createWatchLineFromPreparedImage(images[imageIndex], audienceSegment));
        imageIndex += 1;
    }

    return next;
}
