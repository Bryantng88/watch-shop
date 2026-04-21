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
        kind: "WATCH",
        quickInput: "",
        aiHint: "",
        quantity: 1,
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
        kind: "WATCH",
        quickInput: "",
        aiHint: "",
        quantity: 1,
        cost: "",
        receiveService: true,
        imageKey: image.key ?? null,
        imageUrl: image.url ?? null,
    };
}

export function isBlankWatchLine(line: AcquisitionWatchLine) {
    return (
        !line.quickInput?.trim() &&
        !line.aiHint?.trim() &&
        (line.cost === "" || Number(line.cost || 0) === 0) &&
        Number(line.quantity || 1) === 1 &&
        line.receiveService === true &&
        !line.imageKey &&
        !line.imageUrl
    );
}