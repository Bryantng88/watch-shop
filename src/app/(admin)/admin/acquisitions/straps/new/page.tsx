import { redirect } from "next/navigation";
export default function LegacyNewStrapAcquisitionPage() {
  redirect("/admin/acquisitions/accessories/new?type=strap");
}
