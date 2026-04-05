import { notFound } from "next/navigation";
import ServiceRequestDetailClient from "../_client/ServiceRequestDetailClient";
import { getTechnicalAssessmentPanel } from "../_server/technical_assessment.serivce";

export default async function ServiceRequestDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const detail = await getTechnicalAssessmentPanel(id).catch(() => null);

    if (!detail) {
        notFound();
    }

    return <ServiceRequestDetailClient detail={detail} />;
}