import { listAdminAcquisitions } from "./acquisition-list.repo";
import type { AcquisitionListFilters } from "../../shared/search-params";

export async function getAdminAcquisitionList(input: AcquisitionListFilters) {
    return listAdminAcquisitions(input);
}