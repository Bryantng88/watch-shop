export {
    getWatchContent,
    saveWatchContent,
    syncWatchContentSnapshot,
    submitWatchContentForReview,
    approveWatchContent,
    rejectWatchContent,
    markWatchContentPublished,
    moveWatchContentToDraft,
    updateWatchContentReviewStatus,
} from "./watch-content.service";

export type { WatchContentReviewAction } from "./watch-content.repo";