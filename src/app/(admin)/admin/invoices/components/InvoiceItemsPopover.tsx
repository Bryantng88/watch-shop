import GenericPopover from "../../__components/GenericPopover";

export default function InvoiceItemsPopover({
    invoiceId,
    count,
    currency = "VND",
}: {
    invoiceId: string;
    count: number;
    currency?: string;
}
) {
    return (
        <GenericPopover
            id={invoiceId}
            count={count}
            currency={currency}
            fetchUrl={`/api/admin/invoices/${invoiceId}/items`}
            title="Chi tiết hóa đơn"
            columns={[
                { label: "Tên", render: (r) => r.title },
                { label: "SL", render: (r) => r.quantity },
                { label: "Đơn giá", render: (r) => r.unitPrice.toLocaleString("vi-VN") },
                { label: "Tổng", render: (r) => r.lineTotal.toLocaleString("vi-VN") },
            ]}
            footer={(rows) => {
                const total = rows.reduce((s, r) => s + Number(r.lineTotal), 0);
                return <b>Tổng tiền: {total.toLocaleString("vi-VN")} {currency}</b>;
            }}
        />
    );
}
