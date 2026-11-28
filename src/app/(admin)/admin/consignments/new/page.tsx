import { redirect } from "next/navigation";
export default async function NewConsignment({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const query=await searchParams;const params=new URLSearchParams({new:query.direction==="IN"?"IN":"OUT"});if(typeof query.productId==="string")params.set("productId",query.productId);redirect(`/admin/consignments?${params}`);
}
