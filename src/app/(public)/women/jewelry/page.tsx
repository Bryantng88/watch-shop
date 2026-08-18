import { cookies } from "next/headers";

import StorefrontSectionLanding from "@/domains/storefront/ui/StorefrontSectionLanding";

export default async function WomenJewelryPage() {
  const en = (await cookies()).get("vintic-locale")?.value === "en";
  return <StorefrontSectionLanding
    eyebrow={en ? "For Women" : "Nữ"}
    title={en ? "Jewelry" : "Trang sức"}
    description={en ? "A curated jewelry collection is coming to Vintic. Each piece will be selected with the same care as our watches." : "Bộ sưu tập trang sức tuyển chọn đang được chuẩn bị tại Vintic, với tiêu chuẩn chọn lựa chỉn chu như những chiếc đồng hồ của chúng tôi."}
    actionLabel={en ? "View women's watches" : "Xem đồng hồ Nữ"}
    actionHref="/products?audience=WOMEN"
  />;
}
