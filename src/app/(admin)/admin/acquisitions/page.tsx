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
import { resolveAcquisitionListScope } from "@/domains/acquisition/server/acquisition-access.service";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function firstValue(value: string | string[] | undefined) {
    if (Array.isArray(value)) return value[0] ?? "";
    return value ?? "";
}

function serialize<T>(obj: T): T {
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
    const listScope = resolveAcquisitionListScope(permissions);
    if (listScope === "NONE") redirect("/403");

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
    if (listScope !== "ALL") input.productScope = listScope;
    input.includeFinancials = permissions.includes(PERMISSIONS.PRODUCT_COST_VIEW)
        && (permissions.includes(PERMISSIONS.ACQUISITION_PAYMENT_VIEW)
            || permissions.includes(PERMISSIONS.PAYMENT_VIEW_ALL));

    const [result, vendors, dashboardData] = await Promise.all([
        getAcquisitionListProjection(input),
        getListVendors(),
        getAcquisitionListDashboard(
            input.audienceSegment === "UNISEX" ? undefined : input.audienceSegment,
            input.productScope,
            input.includeFinancials,
        ),
    ]);

    const vendorOptions = (vendors ?? []).map((vendor) => ({
        id: String(vendor.id),
        name: String(vendor.name ?? "-"),
    }));

    return (
        <AcquisitionListClient
            {...serialize(result)}
            vendors={serialize(vendorOptions)}
            dashboardData={serialize(dashboardData)}
            strapOnly={listScope === "ACCESSORY_ONLY"}
            canManage={permissions.includes(PERMISSIONS.PRODUCT_COST_VIEW)
                && (permissions.includes(PERMISSIONS.ACQUISITION_PAYMENT_UPDATE)
                    || permissions.includes(PERMISSIONS.PAYMENT_UPDATE_ALL))
                && (permissions.includes(PERMISSIONS.ACQUISITION_UPDATE_ALL)
                    || permissions.includes(PERMISSIONS.WATCH_ACQUISITION_UPDATE)
                    || permissions.includes(PERMISSIONS.ACCESSORY_ACQUISITION_UPDATE))}
            canViewFinancials={Boolean(input.includeFinancials)}
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
