import { headers } from "next/headers";
import { redirect } from "next/navigation";
import HomeView from "@/domains/storefront/content/HomeView";
import { loadHomeView } from "@/domains/storefront/content/load-view";
export const dynamic = "force-dynamic";
export default async function HomePage() {
  const host = (await headers()).get("host")?.split(":", 1)[0]?.toLowerCase();
  if (host === "admin.vinticwatches.vn") redirect("/admin");
  return <HomeView {...await loadHomeView()} />;
}
