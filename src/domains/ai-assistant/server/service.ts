import { randomUUID } from "node:crypto";
import { Prisma, type CustomerAssistantConversation } from "@prisma/client";
import { prisma, type DB, type Tx } from "@/server/db/client";
import { executeIntakeLookup } from "@/domains/sales-intake/server/intake-lookups";
import { createTechnicalIssue } from "@/domains/service/server/issue-board/service-issue-board.service";
import { getOrCreateActiveWatchServiceTx } from "@/domains/service/server/watch-quick/watch-active-service.service";
import { resolveOperationSpace } from "@/domains/coordination/server/operation-space.service";
import { ensureTaskItemReferenceBinding } from "@/domains/task/server/business-binding.service";
import { recordBusinessEvent } from "@/domains/event/server/business-event.service";
import { assistantLookupSchema, assistantPlanSchema, hasUniqueEvidence, planHasEvidence, type AssistantPlan, type Evidence } from "../live-contract";
import { newConversation } from "../simulation";
import { assistantProductCards } from "./product-images";
import type { CustomerRequest } from "../customer-request";
import { AssistantError, assistantActor, assistantRecipient } from "./access";
import { LOOKUP_PERMISSIONS, assistantCapabilities, hasAssistantPermission, lookupAllowed, planDeniedReason } from "../capabilities";
import { archiveApproved, readableMessages, workerHistory, type AssistantState } from "./conversation-state";
import { authorizeTaskItemDetail } from "@/domains/task/server/core/task-item-detail.service";

type State=AssistantState;
const json=(value:unknown)=>JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
const state=(row:CustomerAssistantConversation)=>row.state as unknown as State;
const evidence=(row:CustomerAssistantConversation)=>row.evidence as unknown as Evidence[];
async function transaction<T>(fn:(tx:Tx)=>Promise<T>):Promise<T>{for(let attempt=0;;attempt++){try{return await prisma.$transaction(fn,{isolationLevel:"Serializable",timeout:45000,maxWait:10000});}catch(e){if(attempt<3&&e instanceof Prisma.PrismaClientKnownRequestError&&(["P2034","P2002"].includes(e.code)||(e.code==="P2010"&&["40001","40P01"].includes(String(e.meta?.code))))){await new Promise(resolve=>setTimeout(resolve,10*(attempt+1)));continue;}throw e;}}}
async function owned(db:DB,id:string,userId:string){const row=await db.customerAssistantConversation.findFirst({where:{id,ownerId:userId}});if(!row)throw new AssistantError("Không có quyền xem cuộc trao đổi này.",403);return row;}
async function lock(tx:Tx,id:string){await tx.$queryRaw`SELECT "id" FROM "CustomerAssistantConversation" WHERE "id"=${id} FOR UPDATE`;}
async function quota(tx:Tx,userId:string){const since=Date.now()-3600000;const configured=Number(process.env.CUSTOMER_AI_MAX_TURNS_PER_HOUR||30);const max=Number.isInteger(configured)&&configured>=1&&configured<=100?configured:30;const rows=await tx.customerAssistantConversation.findMany({where:{ownerId:userId,updatedAt:{gte:new Date(since)}},select:{state:true},take:101});const count=rows.reduce((sum,r)=>sum+((r.state as unknown as State).turnTimes||[]).filter(t=>new Date(t).getTime()>=since).length,0);if(rows.length>100||count>=max)throw new AssistantError("Bạn đã dùng hết lượt trợ lý trong giờ này. Hãy thử lại sau.",429);}
function message(s:State,text:string,requiredPermissions:string[]=[]){return {...s,messages:[...s.messages,{id:randomUUID(),role:"assistant" as const,text,requiredPermissions}]};}
type Actor=Awaited<ReturnType<typeof assistantActor>>;
async function visibleTask(db:DB,id:string,actor:Actor){
 if(!hasAssistantPermission(actor,"TASK_VIEW"))return null;
 const item=await db.taskItem.findUnique({where:{id},select:{id:true,status:true,note:true,userId:true,assignedToUserId:true,task:{select:{kind:true,createdByUserId:true,assignedToUserId:true}}}});
 if(!item)return null;
 try{authorizeTaskItemDetail(item,{user:{id:actor.id},roles:actor.roles.map(r=>r.name),permissions:[...actor.permissions]});return {id:item.id,status:item.status};}catch{return null;}
}
async function authorizedHistory(db:DB,s:State,actor:Actor){
 const messages=readableMessages(s,actor);
 if(hasAssistantPermission(actor,"TASK_VIEW_ALL"))return messages;
 const ids=[...new Set(messages.flatMap(m=>m.requiredTaskIds||[]))].slice(0,1000);
 const readable=new Set<string>();
 if(hasAssistantPermission(actor,"TASK_VIEW")&&ids.length){
  const rows=await db.taskItem.findMany({where:{id:{in:ids}},select:{id:true,note:true,userId:true,assignedToUserId:true,task:{select:{kind:true,createdByUserId:true,assignedToUserId:true}}}});
  for(const item of rows){try{authorizeTaskItemDetail(item,{user:{id:actor.id},roles:actor.roles.map(r=>r.name),permissions:[...actor.permissions]});readable.add(item.id);}catch{/* No task data leaves this authorization boundary. */}}
 }
 return messages.map(m=>m.role==="assistant"&&m.requiredTaskIds?.some(id=>!readable.has(id))?{id:m.id,role:m.role,text:"Nội dung công việc này không còn nằm trong phạm vi được phép của bạn.",requiredPermissions:[]}:m);
}
function readableRequest(r:CustomerRequest,actor:Actor){return hasAssistantPermission(actor,"PRODUCT_VIEW")&&hasAssistantPermission(actor,"TASK_VIEW")&&(hasAssistantPermission(actor,"CUSTOMER_VIEW")||r.customer==="Chưa gắn hồ sơ khách");}
async function linkedRequest(db:DB,r:CustomerRequest,actor:Actor){
 const canReadTechnical=hasAssistantPermission(actor,"SERVICE_VIEW");
 const request=structuredClone(r);if(!hasAssistantPermission(actor,"CUSTOMER_VIEW"))request.customer="Hồ sơ khách ngoài quyền truy cập hiện tại";const labels:Record<string,string>={OPEN:"Chờ tiếp nhận",TODO:"Chờ tiếp nhận",READY:"Sẵn sàng",IN_PROGRESS:"Đang xử lý",PROCESSING:"Đang xử lý",DONE:"Hoàn tất",COMPLETED:"Hoàn tất",CANCELLED:"Đã hủy",CANCELED:"Đã hủy"};
 for(const c of request.conditions){
  if(c.kind==="TECHNICAL"){
   if(!canReadTechnical){c.progress="Không có quyền xem phiếu kỹ thuật";c.requirement="Phiếu kỹ thuật ngoài quyền truy cập hiện tại";c.expected="";c.assignee="";c.outcome="Chưa xác minh";c.result="";delete c.linkedHref;delete c.linkedRef;continue;}
   if(!c.linkedRef)continue;
   const issue=await db.technicalIssue.findUnique({where:{id:c.linkedRef!},select:{executionStatus:true,resolutionNote:true,serviceRequestId:true}});
   if(issue){c.progress=labels[issue.executionStatus]||issue.executionStatus;c.result=c.result||issue.resolutionNote||"";c.linkedHref="/admin/services/issues-board?serviceRequestId="+encodeURIComponent(issue.serviceRequestId);}else c.progress="Không tìm thấy phiếu liên quan";
  }else{if(!c.linkedRef)continue;const item=await visibleTask(db,c.linkedRef!,actor);if(item){c.progress=labels[item.status]||item.status;c.linkedHref="/admin/coordination/operation?view=ad-hoc-work";}else {c.progress="Công việc ngoài quyền truy cập hiện tại";c.requirement="Công việc ngoài quyền truy cập hiện tại";c.expected="";c.assignee="";c.outcome="Chưa xác minh";c.result="";delete c.linkedHref;delete c.linkedRef;}}
 }return request;
}
async function dto(row:CustomerAssistantConversation){
 const actor=await assistantActor(prisma,row.ownerId),s=structuredClone(state(row));
 s.context=null;delete s.pinnedProductId;delete s.turnKeys;delete s.turnTimes;delete s.turnReadScope;s.messages=await authorizedHistory(prisma,s,actor);
 const canReadWork=hasAssistantPermission(actor,"PRODUCT_VIEW")&&hasAssistantPermission(actor,"TASK_VIEW");
 if(!canReadWork){delete s.customerRequest;s.approvedRequests=[];}
 else {
  if(s.customerRequest){if(readableRequest(s.customerRequest,actor))s.customerRequest=await linkedRequest(prisma,s.customerRequest,actor);else delete s.customerRequest;}
  s.approvedRequests=await Promise.all((s.approvedRequests||[]).filter(r=>readableRequest(r.request,actor)).map(async r=>({...r,request:await linkedRequest(prisma,r.request,actor)})));
 }
 const cards=hasAssistantPermission(actor,"PRODUCT_VIEW")?await assistantProductCards(prisma,s.messages.flatMap(m=>m.imageProductIds||[])):[];
 for(const m of s.messages){delete m.products;if(m.role==="assistant"&&m.imageProductIds)m.products=m.imageProductIds.flatMap(id=>cards.filter(c=>c.id===id));}
 return {...s,updatedAt:row.updatedAt.toISOString(),revision:row.revision,runStatus:row.status,errorCode:row.errorCode,approved:!!row.approvedAt,capabilities:assistantCapabilities(actor)};
}
export async function listAssistant(userId:string,id?:string){await assistantActor(prisma,userId);const rows=id?[await owned(prisma,id,userId)]:await prisma.customerAssistantConversation.findMany({where:{ownerId:userId},orderBy:{updatedAt:"desc"},take:20});return {partial:!!id,conversations:await Promise.all(rows.map(row=>dto(row)))};}
export async function sendAssistant(userId:string,input:{id?:string;requestKey:string;text:string;productId?:string|null}){
 const sender=await assistantActor(prisma,userId);
 const id=await transaction(async tx=>{
   let row=input.id?await owned(tx,input.id,userId):await tx.customerAssistantConversation.findUnique({where:{firstRequestKey:input.requestKey}});
   if(row){await lock(tx,row.id);row=await owned(tx,row.id,userId);let s=state(row);if(s.messages.some(m=>m.id===input.requestKey)){if(s.messages.find(m=>m.id===input.requestKey)?.text!==input.text)throw new AssistantError("Mã tin nhắn đã được dùng với nội dung khác.",409);return row.id;}
     if(["QUEUED","RUNNING"].includes(row.status))throw new AssistantError("Đang xử lý tin trước. Bạn có thể hủy hoặc đợi kết quả.",409);
     await quota(tx,userId);
     if(row.approvedAt){s=archiveApproved(s,row.approvedRevision);delete s.customerRequest;s.approved=false;}
     const next={...s,pinnedProductId:hasAssistantPermission(sender,"PRODUCT_VIEW")?input.productId||null:null,messages:[...s.messages,{id:input.requestKey,role:"user",text:input.text}],turnKeys:[],turnTimes:[...(s.turnTimes||[]).filter(t=>new Date(t).getTime()>Date.now()-3600000),new Date().toISOString()]};
     await tx.customerAssistantConversation.update({where:{id:row.id},data:{state:json(next),status:"QUEUED",revision:{increment:1},evidence:[],plan:Prisma.DbNull,approvedAt:null,approvedRevision:null,errorCode:null,leaseToken:null,leaseExpiresAt:null}});return row.id;
   }
   if(await tx.customerAssistantConversation.count({where:{ownerId:userId,status:{in:["QUEUED","RUNNING"]}}})>=3)throw new AssistantError("Bạn đang có 3 yêu cầu chờ.",429);
   await quota(tx,userId);
   if(input.productId&&hasAssistantPermission(sender,"PRODUCT_VIEW")&&!await tx.product.findFirst({where:{id:input.productId,type:"WATCH"},select:{id:true}}))throw new AssistantError("Không tìm thấy watch đang xem.");
   const s=newConversation(null);s.messages=[{id:input.requestKey,role:"user",text:input.text}];s.title=input.text.slice(0,65);
   const created=await tx.customerAssistantConversation.create({data:{id:s.id,ownerId:userId,firstRequestKey:input.requestKey,state:json({...s,turnKeys:[input.requestKey],turnTimes:[new Date().toISOString()],pinnedProductId:hasAssistantPermission(sender,"PRODUCT_VIEW")?input.productId||null:null})}});return created.id;
 });return dto(await owned(prisma,id,userId));
}
export async function cancelAssistant(userId:string,id:string){await assistantActor(prisma,userId);return transaction(async tx=>{await lock(tx,id);const row=await owned(tx,id,userId);if(["QUEUED","RUNNING"].includes(row.status))await tx.customerAssistantConversation.update({where:{id},data:{status:row.approvedAt?"APPLIED":"CANCELLED",leaseToken:null,leaseExpiresAt:null,plan:row.approvedAt?undefined:Prisma.DbNull,state:json(message(state(row),"Đã hủy lượt xử lý. Không giao thêm công việc."))}});return {ok:true};});}
async function leased(tx:Tx,id:string,token:string){const row=await tx.customerAssistantConversation.findFirst({where:{id,leaseToken:token,status:"RUNNING",leaseExpiresAt:{gt:new Date()}}});if(!row)throw new AssistantError("Lượt xử lý đã hết hiệu lực.",409);await assistantActor(tx,row.ownerId);return row;}
export async function assistantWorker(operation:string,body:Record<string,unknown>){
 if(operation==="claim")return transaction(async tx=>{
   const expired=await tx.customerAssistantConversation.findMany({where:{status:"RUNNING",leaseExpiresAt:{lt:new Date()}},take:20});for(const r of expired)await tx.customerAssistantConversation.update({where:{id:r.id},data:{status:r.approvedAt?"APPLIED":"FAILED",errorCode:"LEASE_EXPIRED",leaseToken:null}});
   const row=await tx.customerAssistantConversation.findFirst({where:{status:"QUEUED"},orderBy:{updatedAt:"asc"}});if(!row)return {run:null};
   let actor:Awaited<ReturnType<typeof assistantActor>>;try{actor=await assistantActor(tx,row.ownerId);}catch{await tx.customerAssistantConversation.update({where:{id:row.id},data:{status:row.approvedAt?"APPLIED":"FAILED",errorCode:"REQUESTER_UNAUTHORIZED"}});return {run:null};}
   const currentState=state(row),capabilities=assistantCapabilities(actor);
   const previousRequest=hasAssistantPermission(actor,"PRODUCT_VIEW")&&hasAssistantPermission(actor,"TASK_VIEW")&&currentState.customerRequest&&readableRequest(currentState.customerRequest,actor)?await linkedRequest(tx,currentState.customerRequest,actor):null;
   const approvedRequests=hasAssistantPermission(actor,"PRODUCT_VIEW")&&hasAssistantPermission(actor,"TASK_VIEW")?await Promise.all((currentState.approvedRequests||[]).filter(r=>readableRequest(r.request,actor)).slice(-8).map(async r=>{const r2=await linkedRequest(tx,r.request,actor);return {revision:r.revision,reference:r2.reference,watch:r2.watch,conditions:r2.conditions.map(c=>({requirement:c.requirement.slice(0,250),progress:c.progress,outcome:c.outcome}))}})):[];
   const history=await authorizedHistory(tx,currentState,actor);
   const requests=[...(previousRequest?[previousRequest]:[]),...await Promise.all((currentState.approvedRequests||[]).filter(r=>readableRequest(r.request,actor)).slice(-8).map(r=>linkedRequest(tx,r.request,actor)))];
   // A model may repeat any supplied business information without doing a new lookup.
   const turnReadScope={permissions:[...new Set([...history.slice(-12).flatMap(m=>m.role==="assistant"?m.requiredPermissions||[]:[]),...requests.flatMap(r=>["PRODUCT_VIEW","TASK_VIEW",...(r.customer!=="Chưa gắn hồ sơ khách"?["CUSTOMER_VIEW"]:[]),...(r.conditions.some(c=>c.kind==="TECHNICAL"&&c.linkedRef)?["SERVICE_VIEW"]:[])])])],taskIds:[...new Set([...history.slice(-12).flatMap(m=>m.requiredTaskIds||[]),...requests.flatMap(r=>r.conditions.filter(c=>c.kind==="TASK"&&c.linkedRef).map(c=>c.linkedRef!))])]};
   const token=randomUUID();await tx.customerAssistantConversation.update({where:{id:row.id},data:{state:json({...currentState,turnReadScope}),status:"RUNNING",leaseToken:token,leaseExpiresAt:new Date(Date.now()+120000)}});
   return {run:{id:row.id,leaseToken:token,text:JSON.stringify({...workerHistory({...currentState,messages:history},actor),screenProductHint:hasAssistantPermission(actor,"PRODUCT_VIEW")?currentState.pinnedProductId:null,previousRequest:previousRequest?{...previousRequest,original:undefined}:null,approvedRequests,alreadyApproved:!!row.approvedAt,requester:{id:row.ownerId,name:actor.name,...capabilities}}),referenceTime:new Date().toISOString(),timeZone:"Asia/Ho_Chi_Minh"}};
 });
 const id=String(body.id||""),token=String(body.leaseToken||"");
 if(!/^[a-f0-9-]{36}$/.test(id)||!/^[a-f0-9-]{36}$/.test(token))throw new AssistantError("Lượt xử lý không hợp lệ.");
 return transaction(async tx=>{
   const row=await leased(tx,id,token);
   if(operation==="heartbeat"){await tx.customerAssistantConversation.update({where:{id},data:{leaseExpiresAt:new Date(Date.now()+120000)}});return {active:true};}
   if(operation==="lookup"){
     const request=assistantLookupSchema.parse(body.lookup),entries=evidence(row),actor=await assistantActor(tx,row.ownerId);
     if(!lookupAllowed(actor,request.tool))return {evidence:{request,result:{accessDenied:true,reason:"Tài khoản hiện tại không có quyền thực hiện thao tác này. Không có dữ liệu nghiệp vụ được đọc."}}};
     const prior=entries.find(e=>JSON.stringify(e.request)===JSON.stringify(request));if(!prior&&entries.length>=16)throw new AssistantError("Đã hết lượt tra cứu.");
     if(request.tool==="watches.images"&&!entries.some(e=>e.request.tool==="watches.search"&&Array.isArray(e.result.matches)&&(e.result.matches as {id:string}[]).some(m=>m.id===request.productId)))return {evidence:{request,result:{lookupRejected:true,reason:"Cần tìm sản phẩm trước khi xem ảnh; chỉ dùng ID có trong kết quả tìm kiếm."}}};
     if("productId" in request&&request.tool!=="watches.images"&&!hasUniqueEvidence(entries,"watches.search",request.productId))return {evidence:{request,result:{lookupRejected:true,reason:"Chưa xác định duy nhất đồng hồ. Nếu đang hỏi danh sách, trả danh sách tìm được; nếu cần thao tác cụ thể, hỏi lại người dùng để xác định watch. Không tự chọn một ID."}}};
     if("customerId" in request&&request.customerId&&!hasUniqueEvidence(entries,"customers.search",request.customerId))return {evidence:{request,result:{lookupRejected:true,reason:"Chưa xác định duy nhất hồ sơ khách. Hỏi lại nếu cần gắn hồ sơ; không tự chọn khách."}}};
     let result:Record<string,unknown>;
     if(request.tool==="watches.images"){
       const cards=await assistantProductCards(tx,[request.productId]);const card=cards[0];result=card?{productId:card.id,title:card.title,sku:card.sku,imageCount:card.images.length,displayedInChat:true}:{productId:request.productId,imageCount:0,displayedInChat:false};
     }else if(request.tool==="people.search"){
       const people=await tx.user.findMany({where:{isActive:true,OR:[{id:request.query},{name:{contains:request.query,mode:"insensitive"}}],roles:{some:{OR:[{name:"ADMIN"},{permissions:{some:{code:{in:["TASK_VIEW","TASK_MANAGE"]}}}}]}}},select:{id:true,name:true,roles:{select:{name:true,permissions:{where:{code:{in:["SERVICE_UPDATE","TASK_VIEW","TASK_MANAGE"]}},select:{code:true}}}}},take:7,orderBy:{id:"asc"}});
       result={matches:people.slice(0,6).map(p=>({id:p.id,name:p.name,canTechnical:p.roles.some(r=>r.name==="ADMIN"||r.permissions.some(p=>p.code==="SERVICE_UPDATE"))})),truncated:people.length>6};
     }else if(request.tool==="technical.catalog"){
       const actor=await assistantActor(tx,row.ownerId);if(!actor.admin&&!actor.permissions.has("SERVICE_VIEW"))result={matches:[],truncated:false,accessDenied:true};else{const matches=await tx.technicalDetailCatalog.findMany({where:{isActive:true,OR:[{id:request.query},{code:{equals:request.query,mode:"insensitive"}},{name:{contains:request.query,mode:"insensitive"}}]},select:{id:true,name:true,code:true,area:true,updatedAt:true},take:7,orderBy:{id:"asc"}});result={matches:matches.slice(0,6),truncated:matches.length>6};}
     }else{
       const actor=await assistantActor(tx,row.ownerId);if(request.tool==="accessories.search"&&!actor.admin&&!actor.permissions.has("ACCESSORY_VIEW"))result={matches:[],truncated:false,accessDenied:true};else {result=await executeIntakeLookup(tx,request);if(request.tool==="work.open")result={...result,followups:[],openWatchWork:(await Promise.all((result.openWatchWork as {id:string}[]).map(item=>visibleTask(tx,item.id,actor)))).filter((item):item is NonNullable<typeof item>=>!!item),caution:"Only visible tasks are shown; the server rechecks all conflicts privately at approval."};}
     }
     const entry={request,result};await tx.customerAssistantConversation.update({where:{id},data:{evidence:json(prior?entries.map(e=>e===prior?entry:e):[...entries,entry])}});return {evidence:entry};
   }
   if(operation!=="finish")throw new AssistantError("Lệnh không hợp lệ.");
   const failed=body.failed===true;let reply=typeof body.reply==="string"?body.reply.trim().slice(0,1500):"";if(!reply&&!failed)throw new AssistantError("Thiếu câu trả lời.");
   const actor=await assistantActor(tx,row.ownerId);
   const inherited=state(row).turnReadScope||{permissions:[],taskIds:[]};
   const required=[...new Set([...inherited.permissions,...evidence(row).flatMap(e=>LOOKUP_PERMISSIONS[e.request.tool]||[])])];
   const scopedTaskIds=[...new Set([...inherited.taskIds,...evidence(row).flatMap(e=>e.request.tool==="work.open"?(e.result.openWatchWork as {id:string}[]||[]).map(t=>t.id):[])])];
   const scopeRevoked=!hasAssistantPermission(actor,"TASK_VIEW_ALL")&&(await Promise.all(scopedTaskIds.map(id=>visibleTask(tx,id,actor)))).some(t=>!t);
   const revoked=scopeRevoked||required.some(p=>!hasAssistantPermission(actor,p));
   if(revoked)reply="Quyền của bạn đã thay đổi trong lúc xử lý. Mình chưa thể trả dữ liệu hoặc thực hiện thao tác đó; bạn có thể tiếp tục trao đổi.";
   let plan:AssistantPlan|undefined,request:CustomerRequest|undefined;
   if(!failed&&!revoked&&!row.approvedAt&&body.plan){plan=assistantPlanSchema.parse(body.plan);const denied=planDeniedReason(actor,plan);
     if(denied){plan=undefined;reply=denied;}
     else if(!planHasEvidence(plan,evidence(row))){plan=undefined;reply="Mình chưa xác minh đủ watch, danh mục hoặc người nhận (và hồ sơ khách nếu có gắn). Bạn cho mình thông tin cụ thể để tránh chọn nhầm nhé.";}
     else request=await requestFromPlan(tx,row,plan);
   }
   if(plan)reply="Mình đề xuất giao các việc bên dưới. Bạn duyệt trước khi thực hiện nhé.";
   if(row.approvedAt&&body.plan)reply="Các việc đã giao không tự sửa qua chat. Bạn mở phiếu/task liên quan để thực hiện thay đổi theo luồng hiện có nhé.";
   const s=state(row);delete s.turnReadScope;
   const next=message(s,failed?"Codex chưa hoàn tất lượt này. Bạn có thể nhắn lại để thử tiếp; chưa giao thêm việc.":reply,revoked?[]:required);
   if(!failed&&!revoked&&scopedTaskIds.length)next.messages[next.messages.length-1].requiredTaskIds=scopedTaskIds;
   if(!failed&&!revoked&&hasAssistantPermission(actor,"PRODUCT_VIEW")){const ids=evidence(row).flatMap(e=>e.request.tool==="watches.images"&&Number(e.result.imageCount)>0?[e.request.productId]:[]);if(ids.length)next.messages[next.messages.length-1].imageProductIds=[...new Set(ids)].slice(0,6);}
   if(!row.approvedAt){if(request&&plan){next.customerRequest=request;next.context=null;}else delete next.customerRequest;}
   await tx.customerAssistantConversation.update({where:{id},data:{state:json(next),status:row.approvedAt?"APPLIED":failed?"FAILED":plan?"DRAFT":"NEEDS_INFO",plan:row.approvedAt?undefined:plan?json(plan):Prisma.DbNull,errorCode:failed?"GENERATION_FAILED":null,leaseToken:null,leaseExpiresAt:null}});return {accepted:true};
 });
}
async function requestFromPlan(tx:DB,row:CustomerAssistantConversation,plan:AssistantPlan):Promise<CustomerRequest>{
 const customer=plan.customerId?await tx.customer.findUniqueOrThrow({where:{id:plan.customerId},select:{name:true}}):null,product=await tx.product.findUniqueOrThrow({where:{id:plan.productId},select:{sku:true,title:true}}),actor=await assistantActor(tx,row.ownerId);
 const conditions=[];for(const c of plan.conditions){const person=await assistantRecipient(tx,c.assigneeUserId,c.kind==="TECHNICAL");if(!person)throw new AssistantError("Người nhận không còn hợp lệ.");conditions.push({id:c.key,requirement:c.requirement,expected:c.expected,kind:c.kind,assignee:person.name||`Nhân viên ${person.id.slice(0,8)}`,progress:"Chưa giao",outcome:"Chưa xác minh",result:""});}
 return {id:row.id,reference:"",customer:customer?.name||"Chưa gắn hồ sơ khách",watch:product.sku||product.title,owner:actor.name||"Bạn",original:state(row).messages.filter(m=>m.role==="user").slice(-12).map(m=>m.text).join("\n"),status:"DRAFT",conditions,decision:"Chưa quyết định",reviewReady:true};
}

export async function approveAssistant(userId:string,id:string,revision:number,defer:(work:()=>Promise<void>)=>void){
 const completed=await transaction(async tx=>{
   await lock(tx,id);const row=await owned(tx,id,userId);const actor=await assistantActor(tx,userId);
   const replay=(state(row).approvedRequests||[]).find(r=>r.revision===revision);
   if(replay)return {row,work:[]};
   if(row.approvedAt){if(row.approvedRevision===revision)return {row,work:[]};throw new AssistantError("Yêu cầu đã được duyệt.",409);}
   if(row.status!=="DRAFT"||row.revision!==revision)throw new AssistantError("Bản đề xuất đã thay đổi. Hãy xem bản mới trước khi duyệt.",409);
   const plan=assistantPlanSchema.parse(row.plan),entries=evidence(row),denied=planDeniedReason(actor,plan);if(denied)throw new AssistantError(denied,403);if(!planHasEvidence(plan,entries))throw new AssistantError("Thiếu dữ liệu xác minh.",409);
   await tx.$queryRaw`SELECT "id" FROM "Product" WHERE "id"=${plan.productId} FOR UPDATE`;
   const detail=entries.find(e=>e.request.tool==="watches.detail"),now=await executeIntakeLookup(tx,{tool:"watches.detail",productId:plan.productId});
   if(!detail||["version","watchVersion","activeReservations"].some(k=>now[k]!==detail.result[k]))throw new AssistantError("Watch đã thay đổi sau khi tra cứu. Nhắn lại để Codex cập nhật phương án.",409);
   if(plan.customerId){
   const observed=entries.filter(e=>e.request.tool==="customers.search").flatMap(e=>e.result.matches as {id:string;version:string}[]||[]).find(c=>c.id===plan.customerId),customer=await tx.customer.findUnique({where:{id:plan.customerId},select:{updatedAt:true}});
   if(!customer||customer.updatedAt.toISOString()!==observed?.version)throw new AssistantError("Khách đã thay đổi sau khi tra cứu. Cần cập nhật đề xuất.",409);
   }
   if(Number(now.activeReservations)>0||now.stockStage!=="IN_STOCK")throw new AssistantError("Watch không ở trạng thái sẵn trong kho hoặc đang có giữ hàng. Cần đối chiếu trước khi giao thêm việc.",409);
   const open=await executeIntakeLookup(tx,{tool:"work.open",productId:plan.productId,customerId:plan.customerId});if(open.truncated||(open.openWatchWork as unknown[]).length||await tx.technicalIssue.count({where:{serviceRequest:{productId:plan.productId},executionStatus:{notIn:["DONE","CANCELED"]}}}))throw new AssistantError("Watch đã có việc hoặc phiếu kỹ thuật đang mở. Cần đối chiếu trước khi giao thêm.",409);
   const work:(()=>Promise<void>)[]=[];const register=(fn:()=>Promise<void>)=>work.push(fn);const r=await requestFromPlan(tx,row,plan);r.status="TRACKING";r.reference=`YC-${row.id.slice(0,8).toUpperCase()}-${revision}`;
   const space=plan.conditions.some(c=>c.kind==="TASK")?await resolveOperationSpace(tx,{context:"OPERATION"}):null;
   if(plan.conditions.some(c=>c.kind==="TASK")&&!space)throw new AssistantError("Chưa có không gian Vận hành cho task. Quản trị cần khởi tạo qua luồng hiện có.",409);
   for(const [i,c] of plan.conditions.entries()){
     const person=await assistantRecipient(tx,c.assigneeUserId,c.kind==="TECHNICAL");if(!person)throw new AssistantError("Người nhận đã thay đổi hoặc thiếu quyền.",409);
     const note=`Yêu cầu khách hàng ${r.reference}\n${c.expected}\n${plan.customerId?`Khách: ${plan.customerId}`:"Yêu cầu trước đơn hàng; chưa gắn hồ sơ khách."}`;
     if(c.kind==="TECHNICAL"){
       if(!actor.admin&&!["SERVICE_VIEW","SERVICE_CREATE"].every(p=>actor.permissions.has(p)))throw new AssistantError("Bạn thiếu quyền tạo yêu cầu kỹ thuật.",403);
       const catalog=await tx.technicalDetailCatalog.findFirst({where:{id:c.technicalDetailId!,isActive:true}});const seen=entries.filter(e=>e.request.tool==="technical.catalog").flatMap(e=>e.result.matches as {id:string;updatedAt:string}[]||[]).find(m=>m.id===c.technicalDetailId);
       if(!catalog||!seen||new Date(seen.updatedAt).getTime()!==catalog.updatedAt.getTime())throw new AssistantError("Danh mục kỹ thuật đã thay đổi.",409);
       const serviceId=await getOrCreateActiveWatchServiceTx(tx,plan.productId,userId,register);
       const issue=await createTechnicalIssue({serviceRequestId:serviceId,technicalDetailCatalogId:catalog.id,area:catalog.area,summary:c.requirement,note,technicianId:person.id,actorUserId:userId,issueType:"CHECK",actionMode:"INTERNAL",deferConsumers:register},tx);
       r.conditions[i].linkedRef=issue.id;r.conditions[i].progress=issue.executionStatus;
       await tx.notification.create({data:{userId:person.id,type:`CUSTOMER_AI_${id}_${revision}_${c.key}`,title:"Yêu cầu kỹ thuật từ khách hàng",message:c.requirement,metadata:{customerAssistantId:id,technicalIssueId:issue.id,route:`/admin/services/issues-board?serviceRequestId=${serviceId}`}}});
     }else if(space){
       const item=await tx.taskItem.create({data:{taskId:space.task.id,title:c.requirement,note:["workTypeKey: ad-hoc-work","blueprintKey: ad-hoc-work","blueprintSource: REGISTRY","workspaceKind: STANDALONE_WORKSPACE","operationWorkspaceRole: AD_HOC_WORK","ownerType: USER","workspaceType: ad-hoc-work","shareGroupKey: operation","itemLabel: Việc phát sinh","defaultView: items","identityTargetType: WATCH",`requestDetail: ${c.expected.replace(/[\r\n]/g," ")}`,note].join("\n"),userId,assignedToUserId:person.id,workTypeId:"ad-hoc-work"}});
       await ensureTaskItemReferenceBinding(tx,{taskId:space.task.id,taskItemId:item.id,targetType:"WATCH",targetId:plan.productId,actionType:"LINKED",createdByUserId:userId,metadataJson:{source:"CUSTOMER_AI",customerAssistantId:id,customerId:plan.customerId,workTypeKey:"ad-hoc-work",targetTitle:String(now.title||r.watch),targetRef:r.watch,targetHref:`/admin/watches/${plan.productId}`,intakeNote:c.expected}});
       await tx.taskItemActivity.create({data:{taskItemId:item.id,actorUserId:userId,sourceType:"SYSTEM",sourceId:id,title:"Giao việc sau khi duyệt yêu cầu khách hàng",body:c.expected}});
       await recordBusinessEvent(tx,{eventKey:"task.item.created",targetType:"TASK_ITEM",targetId:item.id,actorUserId:userId,payload:{taskId:space.task.id,taskItemId:item.id,taskItemTitle:item.title,assignedToUserId:person.id,workspaceKind:"STANDALONE_WORKSPACE",operationWorkspaceRole:"AD_HOC_WORK",workTypeKey:"ad-hoc-work"}},{deferConsumers:register});
       await tx.notification.create({data:{userId:person.id,taskId:space.task.id,type:`CUSTOMER_AI_${id}_${revision}_${c.key}`,title:"Công việc từ yêu cầu khách hàng",message:c.requirement,metadata:{customerAssistantId:id,taskItemId:item.id,route:"/admin/coordination/operation?view=ad-hoc-work"}}});r.conditions[i].linkedRef=item.id;r.conditions[i].progress=item.status;
     }
   }
   const next=archiveApproved({...state(row),customerRequest:r,approved:true},revision);const updated=await tx.customerAssistantConversation.update({where:{id},data:{approvedAt:new Date(),approvedRevision:revision,status:"APPLIED",state:json(message(next,"Đã giao các phiếu/task theo bản bạn duyệt. Bạn có thể mở công việc liên quan để theo dõi."))}});return {row:updated,work};
 });for(const fn of completed.work)defer(fn);return dto(completed.row);
}
export async function recordConditionOutcome(userId:string,id:string,conditionId:string,outcome:string,result:string,requestRevision?:number){
 const actor=await assistantActor(prisma,userId);if(!hasAssistantPermission(actor,"TASK_MANAGE"))throw new AssistantError("Bạn chưa có quyền cập nhật kết quả công việc.",403);return transaction(async tx=>{await lock(tx,id);const row=await owned(tx,id,userId);const currentActor=await assistantActor(tx,userId);if(!hasAssistantPermission(currentActor,"TASK_MANAGE"))throw new AssistantError("Bạn chưa có quyền cập nhật kết quả công việc.",403);if(["QUEUED","RUNNING"].includes(row.status))throw new AssistantError("Chưa thể cập nhật kết quả lúc này.",409);const s=state(row);const request=requestRevision!==undefined?s.approvedRequests?.find(r=>r.revision===requestRevision)?.request:row.approvedAt?s.customerRequest:undefined;if(!request?.conditions.some(c=>c.id===conditionId))throw new AssistantError("Không tìm thấy điều kiện đã duyệt.");request.conditions=request.conditions.map(c=>c.id===conditionId?{...c,outcome,result}:c);if(row.approvedRevision===requestRevision)s.customerRequest=request;await tx.customerAssistantConversation.update({where:{id},data:{state:json(s)}});return {ok:true};});
}
