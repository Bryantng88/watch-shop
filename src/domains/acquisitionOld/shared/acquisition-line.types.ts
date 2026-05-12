export type AcquisitionPreparedImage = {
    key: string;
    url: string;
    fromKey?: string;
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
};

export type AcquisitionStrapLine = {
    id: string;
    kind: "STRAP";
    quickInput: string;
    quantity: number;
    cost: number | "";
    imageKey?: string | null;
    imageUrl?: string | null;
};

export type AcquisitionLine = AcquisitionWatchLine | AcquisitionStrapLine;