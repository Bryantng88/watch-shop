import type { Conversation } from "./simulation";

export type PendingNavigation={requestKey:string;conversationId:string};
// No persisted automatic navigation: only this browser's pending submission can consume it.
export function takeNavigation(pending:PendingNavigation|null,row:Conversation|undefined){
 if(!pending||!row||row.id!==pending.conversationId||!["NEEDS_INFO","APPLIED"].includes(row.runStatus||"")||row.orderDraft||row.permissionRequest)return null;
 const last=row.messages.at(-1),user=row.messages.filter(m=>m.role==="user").at(-1);
 return last?.role==="assistant"&&last.navigationResult?.code==="READY"&&last.navigation&&last.navigationRequestKey===pending.requestKey&&user?.id===pending.requestKey?last.navigation:null;
}
