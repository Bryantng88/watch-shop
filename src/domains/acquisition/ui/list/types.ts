import type {
    AcquisitionListProjectionItem,
    AcquisitionListProjectionRow,
} from "@/domains/acquisition/shared/acquisition-list.projection";

export type AcquisitionListView = "all" | "draft" | "posted" | "canceled";

export type AcquisitionVendorOption = {
    id: string;
    name: string;
};

export type AcquisitionListItemDetail = AcquisitionListProjectionItem;
export type AcquisitionListItem = AcquisitionListProjectionRow;

export type AcquisitionListClientProps = {
    items: AcquisitionListItem[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    vendors: AcquisitionVendorOption[];
    selectedIds?: string[];
    onSelectedIdsChange?: React.Dispatch<React.SetStateAction<string[]>>;
};
