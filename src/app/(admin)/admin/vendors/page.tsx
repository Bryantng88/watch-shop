import { requireAnyPermission } from "@/server/auth/requirePermission";
import { contactAccess, VENDOR_READ_PERMISSIONS } from "@/domains/contacts/shared/contact-access";
import ContactDirectory from "@/domains/contacts/client/ContactDirectory";
export const metadata = { title: "Nhà cung cấp · Danh bạ" };
export default async function VendorsPage() {
  const user = await requireAnyPermission(VENDOR_READ_PERMISSIONS);
  const access = contactAccess(user, "vendors");
  return <ContactDirectory key="vendors" kind="vendors" canCreate={access.create} canUpdate={access.update} />;
}
