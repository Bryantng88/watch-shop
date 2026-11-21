import { redirect } from "next/navigation";
import { requireAnyPermission } from "@/server/auth/requirePermission";
import { SYSTEM_READ_PERMISSIONS, systemEntries } from "@/domains/shared/ui/navigation/section-navigation";
export default async function SystemPage() {
  const user = await requireAnyPermission(SYSTEM_READ_PERMISSIONS);
  redirect(systemEntries(user)[0]?.href ?? "/403");
}
