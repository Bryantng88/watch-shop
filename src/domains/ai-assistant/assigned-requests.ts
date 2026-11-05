import type { Conversation } from "./simulation";

export function assignedRequests(chat?: Conversation) {
  const current = chat?.customerRequest?.status === "TRACKING" ? chat.customerRequest : undefined;
  const rows = (chat?.approvedRequests || []).filter(r=>r.request.status==="TRACKING").map(r=>({...r,current:!!current&&r.request.reference===current.reference,key:r.request.reference||String(r.revision)}));
  if(current&&!rows.some(r=>r.request.reference===current.reference))rows.push({revision:chat?.revision||0,request:current,current:true,key:current.reference||"current"});
  return rows.sort((a,b)=>b.revision-a.revision);
}
