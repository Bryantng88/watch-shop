import type { WatchFormValues } from "@/domains/watch/client/form/watch-form.types";
import {
    buildHashTags,
    buildHookText,
    buildPostText,
    buildPostTitle,
    buildWatchBulletSpecs,
    buildWatchContentWarnings,
    type WatchContentGenerationWarning,
} from "./generate-watch-content.helpers";

export type WatchContentGenerationResult = {
    titleOverride: string;
    hookText: string;
    bulletSpecs: string[];
    hashTags: string;
    postText: string;
    warnings: WatchContentGenerationWarning[];
};

export function generateWatchContent(
    values: WatchFormValues
): WatchContentGenerationResult {
    const titleOverride = buildPostTitle(values);
    const hookText = buildHookText(values);
    const bulletSpecs = buildWatchBulletSpecs(values);
    const hashTags = buildHashTags(values);

    return {
        titleOverride,
        hookText,
        bulletSpecs,
        hashTags,
        postText: buildPostText({
            title: titleOverride,
            body: values.content.body,
            bulletSpecs,
            hookText,
            hashTags,
        }),
        warnings: buildWatchContentWarnings(values),
    };
}