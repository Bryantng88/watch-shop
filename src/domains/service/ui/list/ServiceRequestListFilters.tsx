"use client";

import {
    ListClearButton,
    ListFilterButton,
    ListFilterForm,
    ListSearchInput,
    ListSelect,
} from "@/domains/shared/ui/list/ListFilters";
import { SERVICE_REQUEST_SORT_OPTIONS } from "./helpers";
import type { ServiceRequestFiltersValue } from "./types";

type Props = {
    value: ServiceRequestFiltersValue;
    onChange: (value: ServiceRequestFiltersValue) => void;
    onSubmit: () => void;
    onClear: () => void;
};

export default function ServiceRequestListFilters({ value, onChange, onSubmit, onClear }: Props) {
    return (
        <ListFilterForm
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
            }}
            className="[&>div]:lg:grid-cols-[minmax(320px,1fr)_minmax(180px,220px)_auto_auto]"
        >
            <ListSearchInput
                value={value.q}
                onChange={(event) => onChange({ ...value, q: event.target.value })}
                placeholder="Tìm refNo, watch, SKU, vendor, kỹ thuật viên..."
            />

            <ListSelect
                value={value.sort}
                onChange={(event) => onChange({ ...value, sort: event.target.value })}
                options={SERVICE_REQUEST_SORT_OPTIONS}
            />

            <ListFilterButton>Lọc</ListFilterButton>
            <ListClearButton onClick={onClear}>Xóa lọc</ListClearButton>
        </ListFilterForm>
    );
}
