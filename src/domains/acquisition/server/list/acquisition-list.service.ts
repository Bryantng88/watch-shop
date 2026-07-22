import { prisma } from "@/server/db/client";
import {
    queryAcquisitionListProjection,
    rebuildAcquisitionListProjectionRows,
} from "@/domains/projection/server/acquisition-list";
import type { AcquisitionListFilters } from "../../shared/search-params";

export async function getAcquisitionListProjection(input: AcquisitionListFilters) {
    let result = await queryAcquisitionListProjection(prisma, input);

    if (result.projectionRowCount === 0) {
        await rebuildAcquisitionListProjectionRows(prisma);
        result = await queryAcquisitionListProjection(prisma, input);
    }

    return {
        items: result.items,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
    };
}

/** Compatibility alias for existing callers during the projection cutover. */
export const getAdminAcquisitionList = getAcquisitionListProjection;
