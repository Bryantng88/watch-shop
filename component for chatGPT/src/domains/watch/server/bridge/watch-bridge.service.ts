import * as productService from "@/app/(admin)/admin/products/_server/core/product.service";

export async function bulkPostWatches(input: any) {
  return productService.bulkPostProducts(input);
}

export async function quickOrderWatch(input: any) {
  return productService.quickOrderProduct(input);
}

export async function buyBackFromWatch(input: any) {
  return productService.buyBackProduct(input);
}

export async function consignWatch(input: any) {
  return productService.consignToProduct(input);
}
