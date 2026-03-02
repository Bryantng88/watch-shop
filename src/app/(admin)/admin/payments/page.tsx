import { parsePaymentListSearchParams } from "./_helper/SearchParams";
import PaymentListClient from "./_client/PaymentListClient";
import { getAdminPaymentList } from "./_server/payment.service";


type SearchParams = { [key: string]: string | string[] | undefined };

function serialize(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (_k, v) => {
            if (v instanceof Date) return v.toISOString();
            if (typeof v === "object" && v?._isDecimal) return Number(v);
            return v;
        })
    );
}

export default async function PaymentListPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const sp = new URLSearchParams(
        Object.entries(searchParams).flatMap(([k, v]) =>
            Array.isArray(v) ? v.map((x) => [k, x]) : [[k, v ?? ""]]
        )
    );

    const input = parsePaymentListSearchParams(sp);
    const { items, total, page, pageSize } = await getAdminPaymentList(input);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <PaymentListClient
            items={serialize(items)}
            total={total}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            rawSearchParams={searchParams}
        />
    );
}