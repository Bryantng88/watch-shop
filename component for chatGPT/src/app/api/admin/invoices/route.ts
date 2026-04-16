import { NextRequest, NextResponse } from "next/server";
import { parseInvoiceSearchParams } from "@/app/(admin)/admin/invoices/_utils/search-params";

import { getAdminInvoiceList } from "@/app/(admin)/admin/invoices/_servers/invoice.service";

export async function GET(req: NextRequest) {
    const sp = req.nextUrl.searchParams;
    const input = parseInvoiceSearchParams(sp);
    const result = await getAdminInvoiceList(input);
    return NextResponse.json(result);
}
