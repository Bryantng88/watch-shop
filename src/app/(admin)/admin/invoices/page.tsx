import { getAdminInvoiceList } from "./_servers/invoice.service";
import { parseInvoiceSearchParams } from "./_utils/search-params";
import InvoiceListClient from "./_clients/ListInvoice";

type SearchParams = { [key: string]: string | string[] | undefined };

// serialize Decimal → number
function serialize(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (_, value) => {
            if (value instanceof Date) return value.toISOString();
            if (typeof value === "object" && value?._isDecimal) return Number(value);
            return value;
        })
    );
}

export default async function InvoiceListPage({ searchParams }: { searchParams: SearchParams }) {
    const sp = new URLSearchParams(
        Object.entries(searchParams).flatMap(([k, v]) =>
            Array.isArray(v) ? v.map((x) => [k, x]) : [[k, v ?? ""]]
        )
    );

    const input = parseInvoiceSearchParams(sp);
    const { items, total, page, pageSize } = await getAdminInvoiceList(input);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const normalizedItems = serialize(items);

    return (
        <InvoiceListClient
            items={normalizedItems}
            total={total}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            rawSearchParams={searchParams}
        />
    );
}
