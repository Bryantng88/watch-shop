import { redirect } from "next/navigation";
import { getCurrentUserPermissions } from "@/server/auth/requirePermission";
import { listConsignments } from "@/domains/consignment/server/service";
import { consignmentCapabilities, consignmentReadPermissions, hasAny } from "@/domains/consignment/server/access";
import ConsignmentClient from "@/domains/consignment/ui/ConsignmentClient";
import TradingWorkspace from "@/domains/trading/client/TradingWorkspace";
import { tradingEntries } from "@/domains/trading/shared/trading-navigation";
export const dynamic="force-dynamic";
export default async function ConsignmentsPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const {user,permissions}=await getCurrentUserPermissions();if(!user)redirect("/login");
 const actor={id:user.id,name:user.name,roles:user.roles,permissions};if(!hasAny(actor,consignmentReadPermissions))redirect("/403");
 const params=await searchParams;const first=(key:string)=>typeof params[key]==="string"?params[key] as string:undefined;
 const data=await listConsignments(actor,{id:first("id"),direction:first("direction"),status:first("status"),q:first("q"),page:Math.max(1,Math.min(100000,Number(first("page"))||1))});
 return <TradingWorkspace entries={tradingEntries(actor)} selected="/admin/consignments"><ConsignmentClient data={{...data,capabilities:consignmentCapabilities(actor)}}/></TradingWorkspace>;
}
