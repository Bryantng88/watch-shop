import { prisma } from "@/server/db/client";
import {
    queryAcquisitionListProjection,
} from "@/domains/projection/server/acquisition-list";
import { ensureProjectionReady } from "@/domains/projection/server/projection-read.service";
import type { AcquisitionListFilters } from "../../shared/search-params";

export async function getAcquisitionListProjection(input: AcquisitionListFilters) {
    await ensureProjectionReady(prisma, "acquisition-list");
    const result = await queryAcquisitionListProjection(prisma, input);

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
