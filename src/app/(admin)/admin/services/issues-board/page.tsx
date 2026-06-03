import { TechnicalIssuesBoardClient } from "@/domains/service/ui/issue-board";
import { getTechnicalIssueBoardData } from "@/domains/service/server/issue-board";

function firstValue(value: string | string[] | undefined) {
    if (Array.isArray(value)) return value[0] ?? "";
    return value ?? "";
}

export default async function TechnicalIssueBoardPage({
    searchParams,
}: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
    const sp = (await searchParams) ?? {};
    const serviceRequestId = firstValue(sp.serviceRequestId).trim() || null;

    const data = await getTechnicalIssueBoardData({ serviceRequestId });

    const technicalDetailCatalogOptions =
        data.catalogs?.technicalDetailCatalogOptions ??
        data.technicalDetailCatalogOptions ??
        [];

    return (
        <TechnicalIssuesBoardClient
            items={data.items}
            counts={data.counts}
            catalogs={data.catalogs}
            technicalDetailCatalogOptions={technicalDetailCatalogOptions}
            serviceRequestId={serviceRequestId}
            title={
                serviceRequestId
                    ? "Issue Board của Service Request"
                    : "Technical Issue Board"
            }
            subtitle={
                serviceRequestId
                    ? "Board đang được filter theo một service request cụ thể."
                    : "Điều phối toàn bộ technical issue theo trạng thái vận hành."
            }
        />
    );
}
