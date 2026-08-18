import { cookies } from "next/headers";

import StorefrontSectionLanding from "@/domains/storefront/ui/StorefrontSectionLanding";

export default async function ServicesPage() {
  const en = (await cookies()).get("vintic-locale")?.value === "en";
  return <StorefrontSectionLanding
    eyebrow={en ? "Vintic Care" : "Chăm sóc tại Vintic"}
    title={en ? "Watch Service" : "Dịch vụ đồng hồ"}
    description={en ? "Inspection, maintenance and restoration for vintage and pre-owned watches. The complete service experience is being prepared." : "Kiểm tra, bảo dưỡng và phục hồi đồng hồ vintage, pre-owned. Trải nghiệm dịch vụ đầy đủ đang được hoàn thiện."}
    actionLabel={en ? "Explore watches" : "Khám phá đồng hồ"}
  />;
}
