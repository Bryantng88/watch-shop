import type { AcquisitionDraftResponse } from "./acquisition-ai.types";

export type PickedImage = {
    key: string;
    url: string;
};

export type AcquisitionWatchLine = {
    id: string;
    kind: "WATCH";
    quickInput: string;
    aiHint: string;
    quantity: number;
    cost: number | "";
    receiveService: boolean;
    imageKey: string | null;
    imageUrl: string | null;
    aiDraft: AcquisitionDraftResponse | null;
};
export type AcquisitionStrapLine = {
    id: string;
    kind: "STRAP";
    quickInput: string;
    quantity: number;
    cost: number | "";
};

export type AcquisitionLine = AcquisitionWatchLine | AcquisitionStrapLine;