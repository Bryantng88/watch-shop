export type AcquisitionListSort =
    | "updatedDesc"
    | "updatedAsc"
    | "createdDesc"
    | "createdAsc"
    | "acquiredDesc"
    | "acquiredAsc";

export type AcquisitionListFilters = {
    q?: string;
    vendorId?: string;
    type?: string;
    sort?: AcquisitionListSort;
    page?: number;
    pageSize?: number;
};