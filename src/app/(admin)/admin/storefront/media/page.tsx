import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import WebsiteMediaLibrary from "@/domains/storefront/media/WebsiteMediaLibrary";
export const metadata = { title: "Thư viện ảnh website · Storefront" };
export default async function StorefrontMediaPage() {
  await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
  return <WebsiteMediaLibrary />;
}
