import type { WatchFormValues } from "../form/watch-form.types";
import type { WatchDetailProjection } from "../../shared/watch-detail.projection";

export type WatchWorkbenchPermissions = {
    canViewSensitivePrice: boolean;
    canEditPrice: boolean;
};

export type WatchWorkbenchProps = {
    projection: WatchDetailProjection;
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
