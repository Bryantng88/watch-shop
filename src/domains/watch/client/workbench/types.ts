import type { WatchFormValues } from "../form/watch-form.types";

export type WatchWorkbenchPermissions = {
    canViewSensitivePrice: boolean;
    canEditPrice: boolean;
};

export type WatchWorkbenchProps = {
    detail: Record<string, any>;
    serviceHistory?: any[];
    tradeHistory?: { acquisitions?: any[]; orders?: any[] } | any[];
    permissions: WatchWorkbenchPermissions;
};

export type WatchWorkbenchSection =
    | "pricing"
    | "spec"
    | "content"
    | "images"
    | "trade"
    | "timeline"
    | "projection"
    | "media-modal";

export type WatchWorkbenchValues = WatchFormValues;
