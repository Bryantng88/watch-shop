export {
    getAdminWatchList as getAdminProductList,
    getWatchDetail as detail,
    getWatchEditDetail,
    getWatchServiceHistoryDetail,
    getWatchTradeHistoryDetail,
    createWatchDraft as createProductDraft,
    updateWatchCore as updateProduct,
    removeWatch as remove,
} from "@/domains/watch/server";

export {
    updateWatchSpec,
} from "@/domains/watch/server";

export {
    replaceWatchImages,
    reorderWatchImages,
    setWatchStorefrontImage,
    getWatchImages,
} from "@/domains/watch/server";

export {
    getWatchContent,
    saveWatchContent,
    syncWatchContentSnapshot,
} from "@/domains/watch/server";

export {
    getWatchPricing,
    updateWatchPricing,
    bulkSetWatchSalePrice,
} from "@/domains/watch/server";