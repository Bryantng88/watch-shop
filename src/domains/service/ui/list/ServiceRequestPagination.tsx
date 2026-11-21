"use client";

import { AdminListFooter } from "@/domains/shared/ui/admin-design-contract/AdminListFooter";
type Props = {
    total: number;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function ServiceRequestPagination({ total, page, totalPages, onPageChange }: Props) {
    return <AdminListFooter total={total} unit="hồ sơ dịch vụ" page={page} totalPages={totalPages} onPrevious={() => onPageChange(Math.max(1,page-1))} onNext={() => onPageChange(Math.min(totalPages,page+1))} />;
}
