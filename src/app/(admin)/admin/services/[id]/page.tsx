import { notFound } from "next/navigation";
import ServiceRequestDetailClient from "@/domains/service/client/ServiceRequestDetailClient";
import { getServiceRequestDetailPageData } from "@/domains/service/server/detail";

function serialize<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

export default async function ServiceRequestDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const data = await getServiceRequestDetailPageData(id);

    if (!data) notFound();

    return <ServiceRequestDetailClient detail={serialize(data.detail) as any} issueBoard={serialize(data.issueBoard)} />;
}
