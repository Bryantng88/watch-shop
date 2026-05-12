export type BulkPostFailedItem = {
    id: string;
    error: string;
};

export type BulkPostResponse = {
    ok: boolean;
    posted: string[];
    failed: BulkPostFailedItem[];
    error?: string;
};

export type PostAcquisitionResult =
    | {
        kind: "success";
        posted: string[];
        failed: [];
        message: string;
    }
    | {
        kind: "partial";
        posted: string[];
        failed: BulkPostFailedItem[];
        message: string;
    }
    | {
        kind: "error";
        posted: string[];
        failed: BulkPostFailedItem[];
        message: string;
    };