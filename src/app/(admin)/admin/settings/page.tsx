import { requirePermission } from "@/server/auth/requirePermission";
import SettingsHomeClient from "@/domains/settings/client/SettingsHomeClient";

export default async function SettingsPage() {
  await requirePermission("TASK_VIEW");
  return <SettingsHomeClient />;
}
