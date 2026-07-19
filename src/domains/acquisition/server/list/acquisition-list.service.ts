import { listAdminAcquisitions } from "./acquisition-list.repo";
import type { AcquisitionListFilters } from "../shared/search-params";

export async function getAcquisitionListProjection(input: AcquisitionListFilters) {
    return listAdminAcquisitions(input);
}

/** Compatibility alias for existing callers during the projection cutover. */
export const getAdminAcquisitionList = getAcquisitionListProjection;
