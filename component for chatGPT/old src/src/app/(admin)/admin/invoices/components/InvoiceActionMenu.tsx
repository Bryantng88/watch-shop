"use client";

import GenericActionMenu from "../../__components/GenericActionMenu";

export default function InvoiceActionMenu({
    id,
    status,
}: {
    id: string;
    status: string;
}) {
    return (
        <GenericActionMenu
            id={id}
            actions={[
                {
                    label: "Xem chi tiết",
                    onClick: () => (window.location.href = `/admin/invoices/${id}`),
                },
                {
                    label: "Sửa hóa đơn",
                    hidden: status !== "DRAFT",
                    onClick: () => (window.location.href = `/admin/invoices/${id}/edit`),
                },
                {
                    label: "Xuất PDF",
                    onClick: () => window.open(`/admin/invoices/${id}/pdf`, "_blank"),
                },
                {
                    label: "Duyệt hóa đơn",
                    hidden: status !== "DRAFT",
                    onClick: async () => {
                        await fetch(`/api/admin/invoices/${id}/issue`, {
                            method: "POST",
                        });
                        window.location.reload();
                    },
                },
                {
                    label: "Xóa hóa đơn",
                    danger: true,
                    hidden: status !== "DRAFT",
                    onClick: async () => {
                        if (!confirm("Bạn có chắc muốn xóa hóa đơn không?")) return;
                        await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
                        window.location.reload();
                    },
                },
            ]}
        />
    );
}
