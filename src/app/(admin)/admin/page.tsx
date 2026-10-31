import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/getCurrentUser";
import { getAdminLandingPath } from "@/server/auth/admin-landing";

export default async function AdminIndexPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  redirect(getAdminLandingPath(user));
}
