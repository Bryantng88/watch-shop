import { notFound } from "next/navigation";
import TechnicalWorkbenchClient from "../../_client/TechnicalWorkbenchClient";
import { getTechnicalAssessmentPanel } from "../../_server/technical_assessment.serivce";

export default async function ServiceTechnicalWorkbenchPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const detail = await getTechnicalAssessmentPanel(id).catch(() => null);

    if (!detail) {
        notFound();
    }

    return <TechnicalWorkbenchClient detail={detail} />;
}