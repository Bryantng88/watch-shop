import { cookies } from "next/headers";

import StorefrontSectionLanding from "@/domains/storefront/ui/StorefrontSectionLanding";

export default async function ConsignPage() {
  const en = (await cookies()).get("vintic-locale")?.value === "en";
  return <StorefrontSectionLanding
    eyebrow={en ? "Sell with Vintic" : "Bán cùng Vintic"}
    title={en ? "Sell Your Watch" : "Bán đồng hồ của bạn"}
    description={en ? "A transparent, considered selling experience for noteworthy watches. The submission flow is being prepared." : "Quy trình tiếp nhận minh bạch và chỉn chu dành cho những chiếc đồng hồ đáng chú ý. Luồng gửi thông tin đang được hoàn thiện."}
    actionLabel={en ? "Explore watches" : "Khám phá đồng hồ"}
  />;
}
