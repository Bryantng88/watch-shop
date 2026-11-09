import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import StorefrontManager from "@/domains/storefront/content/StorefrontManager";
export const metadata = { title: "Trang chủ website · Storefront" };
export default async function StorefrontHomePage() {
  await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
  return (
    <StorefrontManager
      homeOnly
      storefrontUrl={
        process.env.NEXT_PUBLIC_STOREFRONT_URL || "https://vinticwatches.vn"
      }
    />
  );
}
