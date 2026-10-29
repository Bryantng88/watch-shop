import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import StorefrontManager from "@/domains/storefront/content/StorefrontManager";
export default async function StorefrontSettings() {
  await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
  return <StorefrontManager />;
}
