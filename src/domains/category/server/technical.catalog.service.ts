import {
    listTechnicalActionCatalog,
    listTechnicalAppearanceIssueCatalog,
    listTechnicalDetailCatalog,
    listTechnicalPartCatalog,
    upsertTechnicalActionCatalog,
    upsertTechnicalAppearanceIssueCatalog,
    upsertTechnicalDetailCatalog,
    upsertTechnicalPartCatalog,
} from "./technical.catalog.repo"

export async function getTechnicalCatalogPageData() {
    const [actions, parts, appearanceIssues, technicalDetails] = await Promise.all([
        listTechnicalActionCatalog(),
        listTechnicalPartCatalog(),
        listTechnicalAppearanceIssueCatalog(),
        listTechnicalDetailCatalog(),
    ]);

    return { actions, parts, appearanceIssues, technicalDetails };
}

export async function saveTechnicalCatalogItem(
    kind: "action" | "part" | "appearanceIssue" | "technicalDetail",
    payload: any
) {
    switch (kind) {
        case "action":
            return upsertTechnicalActionCatalog(payload);
        case "part":
            return upsertTechnicalPartCatalog(payload);
        case "appearanceIssue":
            return upsertTechnicalAppearanceIssueCatalog(payload);
        case "technicalDetail":
            return upsertTechnicalDetailCatalog(payload);
        default:
            throw new Error("Loại catalog không hợp lệ");
    }
}