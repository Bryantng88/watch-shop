import { notFound } from "next/navigation";
import ServiceRequestDetailClient from "../_client/ServiceRequestDetailClient";
import { getTechnicalAssessmentPanel, getServiceRequestTechnicalSummary } from "../_server/technical_assessment.serivce";

export default async function ServiceRequestDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const panel = await getTechnicalAssessmentPanel(id).catch(() => null);
    if (!panel) notFound();

    const technicalSummary = await getServiceRequestTechnicalSummary(id);

    return (
        <ServiceRequestDetailClient
            detail={{
                ...panel,
                technicalSummary,
            }}
        />
    );
}