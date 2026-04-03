import {
    upsertTechnicalAssessment,
    replaceTechnicalIssues,
} from "./technical.repo";

export async function saveTechnicalAssessment(
    payload: any,
    opts?: {
        evaluatedById?: string | null;
        evaluatedByNameSnap?: string | null;
    }
) {
    const assessment = await upsertTechnicalAssessment(payload, opts);

    await replaceTechnicalIssues(assessment.id, payload);

    return assessment;
}