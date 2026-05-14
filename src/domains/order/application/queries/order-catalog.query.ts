import { getOrderServiceCatalogQuery } from "@/domains/order/application";

export async function getOrderServiceCatalogQuery() {
  return getServiceCatalogOptions();
}
