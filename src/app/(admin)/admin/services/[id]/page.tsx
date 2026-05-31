import { notFound } from "next/navigation";
import ServiceRequestDetailClient from "@/domains/service/client/ServiceRequestDetailClient";
import { getServiceRequestDetailPageData } from "@/domains/service/server/detail";

export default async function ServiceRequestDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const data = await getServiceRequestDetailPageData(id);

    if (!data) notFound();

    return <ServiceRequestDetailClient detail={data.detail} issueBoard={data.issueBoard} />;
}
