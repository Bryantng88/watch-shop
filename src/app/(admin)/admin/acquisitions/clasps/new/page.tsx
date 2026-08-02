import { redirect } from "next/navigation";
export default function LegacyNewClaspAcquisitionPage() {
  redirect("/admin/acquisitions/accessories/new?type=clasp");
}
