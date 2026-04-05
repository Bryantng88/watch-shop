import {
    listTechnicalActionCatalog,
    listTechnicalAppearanceIssueCatalog,
    listTechnicalPartCatalog,
    upsertTechnicalActionCatalog,
    upsertTechnicalAppearanceIssueCatalog,
    upsertTechnicalPartCatalog,
} from "./technical.catalog.repo"

export async function getTechnicalCatalogPageData() {
    const [actions, parts, appearanceIssues] = await Promise.all([
        listTechnicalActionCatalog(),
        listTechnicalPartCatalog(),
        listTechnicalAppearanceIssueCatalog(),
    ]);

    return { actions, parts, appearanceIssues };
}

export async function saveTechnicalCatalogItem(
    kind: "action" | "part" | "appearanceIssue",
    payload: any
) {
    switch (kind) {
        case "action":
            return upsertTechnicalActionCatalog(payload);
        case "part":
            return upsertTechnicalPartCatalog(payload);
        case "appearanceIssue":
            return upsertTechnicalAppearanceIssueCatalog(payload);
        default:
            throw new Error("Loại catalog không hợp lệ");
    }
}