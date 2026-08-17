import StorefrontHeroManager from "@/domains/settings/client/StorefrontHeroManager";
import { PERMISSIONS } from "@/constants/permissions";
import { requirePermission } from "@/server/auth/requirePermission";

export default async function StorefrontHeroSettingsPage() {
  await requirePermission(PERMISSIONS.PRODUCT_UPDATE);
  return <StorefrontHeroManager />;
}
