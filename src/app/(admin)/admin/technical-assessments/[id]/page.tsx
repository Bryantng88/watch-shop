import { notFound } from "next/navigation";
import TechnicalAssessmentWorkbenchPage from "../../services/_client/TechnicalAssessmentWorkbenchPage";
import { getTechnicalAssessmentWorkbench } from "../../services/_server/technical_assessment.serivce";

export default async function TechnicalAssessmentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const data = await getTechnicalAssessmentWorkbench(id).catch(() => null);

    if (!data) notFound();

    return <TechnicalAssessmentWorkbenchPage data={data} />;
}