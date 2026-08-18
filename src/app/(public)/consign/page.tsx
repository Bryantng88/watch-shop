import { cookies } from "next/headers";

import StorefrontSectionLanding from "@/domains/storefront/ui/StorefrontSectionLanding";

export default async function ConsignPage() {
  const en = (await cookies()).get("vintic-locale")?.value === "en";
  return <StorefrontSectionLanding
    eyebrow={en ? "Sell with Vintic" : "Đồng hành cùng Vintic"}
    title={en ? "Consign Your Watch" : "Ký gửi đồng hồ"}
    description={en ? "A transparent, considered consignment experience for noteworthy watches. The submission flow is being prepared." : "Quy trình ký gửi minh bạch và chỉn chu dành cho những chiếc đồng hồ đáng chú ý. Luồng tiếp nhận đang được hoàn thiện."}
    actionLabel={en ? "Explore watches" : "Khám phá đồng hồ"}
  />;
}
