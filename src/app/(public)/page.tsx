import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const host = (await headers()).get("host")?.split(":", 1)[0]?.toLowerCase();
  if (host === "admin.vinticwatches.vn") redirect("/admin");

  redirect("/products");
}
