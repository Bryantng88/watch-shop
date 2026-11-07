import type { DB } from "@/server/db/client";
import type { ProductCard } from "../simulation";

// Use the existing authenticated media endpoint and server-owned storage keys only.
// Never persist signed URLs or accept URLs supplied by the model.
export function productImageSource(key: string): string | null {
  if (!key || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(key) || key.startsWith("/") || key.split("/").includes("..")) return null;
  return `/api/media/sign?key=${encodeURIComponent(key)}`;
}
export async function assistantProductCards(db: DB, productIds: string[]): Promise<ProductCard[]> {
  const ids=[...new Set(productIds)].slice(0,120);
  if(!ids.length)return [];
  const products=await db.product.findMany({where:{id:{in:ids},type:"WATCH"},select:{id:true,title:true,sku:true,productImage:{where:{isForAdmin:true,role:{in:["INLINE","GALLERY"]}},orderBy:[{role:"asc"},{sortOrder:"asc"},{createdAt:"asc"},{id:"asc"}],take:4,select:{fileKey:true,alt:true}}}});
  return products.map(p=>({id:p.id,title:p.title,sku:p.sku,images:p.productImage.flatMap(image=>{const src=productImageSource(image.fileKey);return src?[{src,alt:image.alt||p.title}]:[];})}));
}
