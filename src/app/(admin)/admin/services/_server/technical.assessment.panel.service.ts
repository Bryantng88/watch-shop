import { getTechnicalAssessmentPanel } from "./technical_assessment.serivce";
import {
    listAppearanceIssueOptions,
    listTechnicalActionOptions,
    listTechnicalPartOptions,
} from "./technical_catalog_bridge.repo";

export async function getTechnicalAssessmentPanelWithCatalogs(serviceRequestId: string) {
    const panel = await getTechnicalAssessmentPanel(serviceRequestId);

    const machineType =
        panel.assessment?.movementKind === "BATTERY" ? "QUARTZ" : "MECHANICAL";

    const [movementActions, parts, appearanceIssues] = await Promise.all([
        listTechnicalActionOptions(machineType),
        listTechnicalPartOptions(machineType),
        listAppearanceIssueOptions(),
    ]);

    return {
        ...panel,
        catalogs: {
            movementActions,
            parts,
            appearanceIssues,
        },
    };
}