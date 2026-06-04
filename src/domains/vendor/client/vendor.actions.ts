"use server";

import { createVendorQuick } from "@/domains/vendor/server";

export async function createQuickVendor(input: {
    name: string;
    phone?: string | null;
}) {
    return createVendorQuick(input);
}
