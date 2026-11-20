import { redirect } from "next/navigation";
import { requireAnyPermission } from "@/server/auth/requirePermission";
import { DIRECTORY_READ_PERMISSIONS, directoryEntries } from "@/domains/contacts/shared/directory-navigation";

export default async function DirectoryPage() {
  const user = await requireAnyPermission(DIRECTORY_READ_PERMISSIONS);
  redirect(directoryEntries(user)[0]?.href ?? "/403");
}
