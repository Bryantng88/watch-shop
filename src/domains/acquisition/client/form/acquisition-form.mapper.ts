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

export function createEmptyWatchLine(): AcquisitionWatchLine {
    return {
        id: uid(),
        quickInput: "",
        aiHint: "",
        cost: "",
        receiveService: true,
        imageKey: null,
        imageUrl: null,
    };
}

export function createWatchLineFromPreparedImage(
    image: AcquisitionPreparedImage
): AcquisitionWatchLine {
    return {
        id: uid(),
        quickInput: "",
        aiHint: "",
        cost: "",
        receiveService: true,
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
        line.receiveService === true &&
        !line.imageKey &&
        !line.imageUrl
    );
}

export function applyPreparedImagesTopDown(
    lines: AcquisitionWatchLine[],
    images: AcquisitionPreparedImage[]
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
        next.push(createWatchLineFromPreparedImage(images[imageIndex]));
        imageIndex += 1;
    }

    return next;
}