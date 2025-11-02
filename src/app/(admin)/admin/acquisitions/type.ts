export type AdminAcqSort =
    | "updatedDesc" | "updatedAsc"
    | "createdDesc" | "createdAsc"
    | "acquiredDesc" | "acquiredAsc";

export interface AdminAcqFilters {
    page?: number;
    pageSize?: number;
    q?: string;                 // refNo, notes
    vendorIds?: string[];
    customerIds?: string[];
    type?: ("PURCHASE" | "CONSIGN" | "TRADEIN")[];
    status?: ("DRAFT" | "POSTED" | "CANCELED")[];
    acquiredFrom?: string | Date;
    acquiredTo?: string | Date;
    hasInvoice?: "yes" | "no";
    sort?: AdminAcqSort;
}
