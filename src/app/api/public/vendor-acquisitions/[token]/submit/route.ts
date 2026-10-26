import { after, NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { submitVendorPricingRequest } from "@/domains/acquisition/server";

const BodySchema = z.object({
  items: z.array(z.object({
    id: z.string().min(1),
    unitCost: z.number().int().positive().max(9_999_999_999),
    vendorNote: z.string().max(500).nullish(),
  })).min(1).max(100),
});

export async function POST(request: NextRequest, context: { params: Promise<{ token: string }> }) {
  try {
    const [{ token }, body] = await Promise.all([context.params, request.json()]);
    const result = await submitVendorPricingRequest(token, {
      ...BodySchema.parse(body),
      deferConsumers: (work) => after(work),
    });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Không thể xác nhận báo giá." }, { status: 400 });
  }
}
