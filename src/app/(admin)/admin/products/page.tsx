import { redirect } from "next/navigation";
import { requireAnyPermission } from "@/server/auth/requirePermission";
import { PRODUCT_READ_PERMISSIONS, productEntries } from "@/domains/shared/ui/navigation/section-navigation";
export default async function ProductsPage() {
  const user = await requireAnyPermission(PRODUCT_READ_PERMISSIONS);
  redirect(productEntries(user)[0]?.href ?? "/403");
}
