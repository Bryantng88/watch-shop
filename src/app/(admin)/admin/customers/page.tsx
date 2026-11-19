import { requirePermission } from "@/server/auth/requirePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { contactAccess } from "@/domains/contacts/shared/contact-access";
import ContactDirectory from "@/domains/contacts/client/ContactDirectory";
import DirectoryWorkspace from "@/domains/contacts/client/DirectoryWorkspace";
import { directoryEntries } from "@/domains/contacts/shared/directory-navigation";
export const metadata = { title: "Khách hàng · Danh bạ" };
export default async function CustomersPage() {
  const user = await requirePermission(PERMISSIONS.CUSTOMER_VIEW);
  const access = contactAccess(user, "customers");
  return <DirectoryWorkspace entries={directoryEntries(user)} selected="/admin/customers"><ContactDirectory key="customers" kind="customers" canCreate={access.create} canUpdate={access.update} /></DirectoryWorkspace>;
}
