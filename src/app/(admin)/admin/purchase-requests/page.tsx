import { redirect } from "next/navigation";

export default function LegacyPurchaseRequestsPage() {
  redirect("/admin/coordination/operation?view=purchase-request-operation-flow");
}
