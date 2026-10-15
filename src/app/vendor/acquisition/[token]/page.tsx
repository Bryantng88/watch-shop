import { notFound } from "next/navigation";

import { getVendorPricingRequestByToken } from "@/domains/acquisition/server";
import VendorPricingForm from "./vendor-pricing-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Xác nhận giá nhập", robots: { index: false, follow: false } };

export default async function VendorAcquisitionPricingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const request = await getVendorPricingRequestByToken(token);
  if (!request) notFound();

  return (
    <VendorPricingForm
      token={token}
      request={{
        vendorName: request.vendor.name,
        currency: request.currency,
        notes: request.notes,
        status: request.status,
        expiresAt: request.expiresAt.toISOString(),
        submittedAt: request.submittedAt?.toISOString() ?? null,
        items: request.items.map((item) => ({
          id: item.id,
          title: item.title,
          audienceSegment: item.audienceSegment,
          hasImage: Boolean(item.imageMediaObjectId || item.imageStorageKey),
          unitCost: item.unitCost?.toString() ?? null,
          vendorNote: item.vendorNote,
        })),
      }}
    />
  );
}
