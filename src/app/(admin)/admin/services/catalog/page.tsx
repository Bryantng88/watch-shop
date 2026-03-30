import { prisma } from "@/server/db/client";
import CatalogManager from "../_client/ServiceCatalogManager";

export default async function ServiceCatalogPage() {
  const items = await prisma.serviceCatalog.findMany({ orderBy: [{ name: "asc" }] });
  return <CatalogManager items={JSON.parse(JSON.stringify(items, (_k,v)=> typeof v==="object" && v?._isDecimal ? Number(v):v))} />;
}
