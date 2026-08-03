//import { getAdminAcquisitionList } from "./_server/core/acquisition.service";
import {
    getAcquisitionListDashboard,
    getAcquisitionListProjection,
} from "@/domains/acquisition/server";
//import AcquisitionListClient from "./_client/ListAcq";
import AcquisitionListClient from "@/domains/acquisition/client/AcquisitionListClient";
import { getCurrentUserPermissions } from "@/server/auth/requirePermission";
import { redirect } from "next/navigation";
import { PERMISSIONS } from "@/constants/permissions";
import { parseAcquisitionListSearchParams } from "@/domains/acquisition/shared/search-params";
import { getListVendors } from "../vendors/_server/vendor.repo";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function firstValue(value: string | string[] | undefined) {
    if (Array.isArray(value)) return value[0] ?? "";
    return value ?? "";
}

function serialize(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (_key, value) => {
            if (value instanceof Date) return value.toISOString();
            if (typeof value === "object" && value?._isDecimal) return Number(value);
            return value;
        })
    );
}

export default async function AcquisitionListPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const { user, permissions } = await getCurrentUserPermissions();
    if (!user) redirect("/login");
    const canViewAll = permissions.includes(PERMISSIONS.ACQUISITION_VIEW);
    const canViewStraps = permissions.includes(PERMISSIONS.STRAP_ACQUISITION_VIEW);
    if (!canViewAll && !canViewStraps) redirect("/403");

    const resolvedSearchParams = await searchParams;

    const input = parseAcquisitionListSearchParams({
        segment: firstValue(resolvedSearchParams.segment),
        view: firstValue(resolvedSearchParams.view),
        q: firstValue(resolvedSearchParams.q),
        vendorId: firstValue(resolvedSearchParams.vendorId),
        type: firstValue(resolvedSearchParams.type),
        status: firstValue(resolvedSearchParams.status),
        sort: firstValue(resolvedSearchParams.sort),
        page: firstValue(resolvedSearchParams.page),
        pageSize: firstValue(resolvedSearchParams.pageSize),
    });
    if (!canViewAll) input.productScope = "ACCESSORY_ONLY";

    const [result, vendors, dashboardData] = await Promise.all([
        getAcquisitionListProjection(input),
        getListVendors(),
        getAcquisitionListDashboard(
            input.audienceSegment === "UNISEX" ? undefined : input.audienceSegment,
            input.productScope,
        ),
    ]);

    const vendorOptions = (vendors ?? []).map((vendor: any) => ({
        id: String(vendor.id),
        name: String(vendor.name ?? "-"),
    }));

    return (
        <AcquisitionListClient
            {...serialize(result)}
            vendors={serialize(vendorOptions)}
            dashboardData={serialize(dashboardData)}
            strapOnly={!canViewAll}
            canManage={permissions.includes(PERMISSIONS.ACQUISITION_UPDATE)}
        />
    );
}

/**function serialize(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (_key, value) => {
            if (value instanceof Date) return value.toISOString();
            if (typeof value === "object" && value?._isDecimal) return Number(value);
            return value;
        })
    );
}

export default async function AcquisitionListPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const resolvedSearchParams = await searchParams;

    const sp = new URLSearchParams(
        Object.entries(resolvedSearchParams).flatMap(([k, v]) =>
            Array.isArray(v) ? v.map((x) => [k, x]) : [[k, v ?? ""]]
        )
    );

    const raw = Object.fromEntries(sp.entries());

    const { items, total, counts, page, pageSize } = await getAdminAcquisitionList(raw);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <AcquisitionListClient
            items={serialize(items)}
            total={total}
            counts={counts}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            rawSearchParams={resolvedSearchParams}
        />
    );
}

*/
