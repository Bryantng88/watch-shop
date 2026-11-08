import {codeEnabled,codePlanSchema,publicCodeJob} from "../code-contract";
import { canReadRepository, BEN_REPOSITORY } from "../repository-access";
import { readRepository, isRepositoryLookup } from "./repository-reader";
import {withWatchReferencePrices} from "./reference-prices";
import {resolveCurrentScreen,screenPathSchema} from "./current-screen";
import { availableScreens, navigationTarget, resolveNavigation } from "../navigation";
import {assistantOrderSchema,orderDeniedPermission,orderPermissions} from "../order-contract";
import {prepareOrder} from "./order-draft";
import {createOrderWithItems} from "@/domains/order/server/write/order-write.service";
import {PERMISSIONS} from "@/constants/permissions";
import {accountQuestion,accountReply,requesterIdentity} from "../account";
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
import { normalizeBenImage } from "./image-search";
import { BEN_IMAGE_LOOKUPS } from "../image-search";
import { archiveApproved, readableMessages, workerHistory, type AssistantState } from "./conversation-state";
import { LONG_SUPPORT_OFFER, SUPPORT_TITLE, permissionContact, permissionSummary } from "./permission-support";
import { authorizeTaskItemDetail } from "@/domains/task/server/core/task-item-detail.service";

type State=AssistantState;
const json=(value:unknown)=>JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
const state=(row:CustomerAssistantConversation)=>row.state as unknown as State;
const evidence=(row:CustomerAssistantConversation)=>row.evidence as unknown as Evidence[];
async function transaction<T>(fn:(tx:Tx)=>Promise<T>):Promise<T>{for(let attempt=0;;attempt++){try{return await prisma.$transaction(fn,{isolationLevel:"Serializable",timeout:45000,maxWait:10000});}catch(e){if(attempt<3&&e instanceof Prisma.PrismaClientKnownRequestError&&(["P2034","P2002"].includes(e.code)||(e.code==="P2010"&&["40001","40P01"].includes(String(e.meta?.code))))){await new Promise(resolve=>setTimeout(resolve,10*(attempt+1)));continue;}throw e;}}}
async function owned(db:DB,id:string,userId:string){const row=await db.customerAssistantConversation.findFirst({where:{id,ownerId:userId}});if(!row)throw new AssistantError("Không có quyền xem cuộc trao đổi này.",403);return row;}
async function lock(tx:Tx,id:string){await tx.$queryRaw`SELECT "id" FROM "CustomerAssistantConversation" WHERE "id"=${id} FOR UPDATE`;}
async function quota(tx:Tx,userId:string){const since=Date.now()-3600000;const configured=Number(process.env.CUSTOMER_AI_MAX_TURNS_PER_HOUR||30);const max=Number.isInteger(configured)&&configured>=1&&configured<=100?configured:30;const rows=await tx.customerAssistantConversation.findMany({where:{ownerId:userId,updatedAt:{gte:new Date(since)}},select:{state:true},take:101});const count=rows.reduce((sum,r)=>sum+((r.state as unknown as State).turnTimes||[]).filter(t=>new Date(t).getTime()>=since).length,0);if(rows.length>100||count>=max)throw new AssistantError("Bạn đã dùng hết lượt trợ lý trong giờ này. Hãy thử lại sau.",429);}
function withoutImage(s:State){const next={...s};delete next.pendingImage;return next;}
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
async function supportScopeVisible(db:DB,s:State,actor:Actor){
 const scope=s.permissionRequestScope;if(!scope)return true;
 return scope.permissions.every(p=>hasAssistantPermission(actor,p))&&(hasAssistantPermission(actor,"TASK_VIEW_ALL")||!(await Promise.all(scope.taskIds.map(id=>visibleTask(db,id,actor)))).some(t=>!t));
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
 delete s.pendingImage;delete s.turnRepositoryAccess;if(!canReadRepository(actor)){delete s.repositorySnapshot;delete s.codeDraft;delete s.codeJob;s.codeJobHistory=[];}else{if(s.codeJob)s.codeJob=publicCodeJob(s.codeJob);s.codeJobHistory=s.codeJobHistory?.map(publicCodeJob);}
 s.context=null;delete s.pinnedProductId;delete s.turnKeys;delete s.turnTimes;delete s.turnReadScope;delete s.permissionTaskIds;delete s.permissionDenied;if(!await supportScopeVisible(prisma,s,actor))delete s.permissionRequest;delete s.permissionRequestScope;s.messages=await authorizedHistory(prisma,s,actor);
 if(!hasAssistantPermission(actor,"ORDER_VIEW")||!hasAssistantPermission(actor,"PRODUCT_VIEW")){delete s.orderDraft;s.createdOrders=[];}else if(s.orderDraft?.plan.customerId&&!hasAssistantPermission(actor,"CUSTOMER_VIEW"))delete s.orderDraft;
 const canReadWork=hasAssistantPermission(actor,"PRODUCT_VIEW")&&hasAssistantPermission(actor,"TASK_VIEW");
 if(!canReadWork){delete s.customerRequest;s.approvedRequests=[];}
 else {
  if(s.customerRequest){if(readableRequest(s.customerRequest,actor))s.customerRequest=await linkedRequest(prisma,s.customerRequest,actor);else delete s.customerRequest;}
  s.approvedRequests=await Promise.all((s.approvedRequests||[]).filter(r=>readableRequest(r.request,actor)).map(async r=>({...r,request:await linkedRequest(prisma,r.request,actor)})));
 }
 const cards=hasAssistantPermission(actor,"PRODUCT_VIEW")?await assistantProductCards(prisma,s.messages.flatMap(m=>m.imageProductIds||[])):[];
 delete s.screenHint;
 for(const m of s.messages){delete m.navigation;if(m.role==="assistant"&&m.navigationKey){const target=navigationTarget(m.navigationKey,actor);if(target)m.navigation=target;}delete m.products;if(m.role==="assistant"&&m.imageProductIds)m.products=m.imageProductIds.flatMap(id=>cards.filter(c=>c.id===id));}
 return {...s,updatedAt:row.updatedAt.toISOString(),revision:row.revision,runStatus:row.status,errorCode:row.errorCode,approved:!!row.approvedAt,capabilities:assistantCapabilities(actor)};
}
export async function listAssistant(userId:string,id?:string){await assistantActor(prisma,userId);const rows=id?[await owned(prisma,id,userId)]:await prisma.customerAssistantConversation.findMany({where:{ownerId:userId},orderBy:{updatedAt:"desc"},take:20});return {partial:!!id,conversations:await Promise.all(rows.map(row=>dto(row)))};}
export async function sendAssistant(userId:string,input:{id?:string;requestKey:string;text:string;productId?:string|null;screenPath?:string|null;imageBase64?:string}){
 const sender=await assistantActor(prisma,userId);
 if(input.imageBase64!==undefined&&(process.env.BEN_IMAGE_SEARCH_ENABLED!=="1"||!hasAssistantPermission(sender,"PRODUCT_VIEW")))
   throw new AssistantError("Tài khoản chưa được phép tìm đồng hồ bằng ảnh.",403);
 const image=input.imageBase64!==undefined?await normalizeBenImage(input.imageBase64):undefined;
 const identityQuestion=!image&&accountQuestion(input.text);
 const screenPath=screenPathSchema.safeParse(input.screenPath);const screenHint=screenPath.success?{pathname:screenPath.data,requestKey:input.requestKey,receivedAt:new Date().toISOString()}:null;
 const id=await transaction(async tx=>{
   let row=input.id?await owned(tx,input.id,userId):await tx.customerAssistantConversation.findUnique({where:{firstRequestKey:input.requestKey}});
   if(row){await lock(tx,row.id);row=await owned(tx,row.id,userId);let s=state(row);if(s.messages.some(m=>m.id===input.requestKey)){if(s.messages.find(m=>m.id===input.requestKey)?.text!==input.text)throw new AssistantError("Mã tin nhắn đã được dùng với nội dung khác.",409);return row.id;}
     if(["QUEUED","RUNNING"].includes(row.status))throw new AssistantError("Đang xử lý tin trước. Bạn có thể hủy hoặc đợi kết quả.",409);
     await quota(tx,userId);
     if(row.approvedAt){s=archiveApproved(s,row.approvedRevision);delete s.customerRequest;s.approved=false;}
     let next:State={...withoutImage(s),...(image?{pendingImage:image}:{}),screenHint,permissionDenied:false,pinnedProductId:hasAssistantPermission(sender,"PRODUCT_VIEW")?input.productId||null:null,messages:[...s.messages,{id:input.requestKey,role:"user",text:input.text}],turnKeys:[],turnTimes:[...(s.turnTimes||[]).filter(t=>new Date(t).getTime()>Date.now()-3600000),new Date().toISOString()]};
     if(identityQuestion){const actor=await assistantActor(tx,userId);delete next.orderDraft;delete next.permissionRequest;delete next.permissionRequestScope;next=message(next,accountReply(actor,actor.id===process.env.CUSTOMER_AI_PERMISSION_CONTACT_USER_ID),[]);}
     await tx.customerAssistantConversation.update({where:{id:row.id},data:{state:json(next),status:identityQuestion?"NEEDS_INFO":"QUEUED",revision:{increment:1},evidence:[],plan:Prisma.DbNull,approvedAt:null,approvedRevision:null,errorCode:null,leaseToken:null,leaseExpiresAt:null}});return row.id;
   }
   if(await tx.customerAssistantConversation.count({where:{ownerId:userId,status:{in:["QUEUED","RUNNING"]}}})>=3)throw new AssistantError("Bạn đang có 3 yêu cầu chờ.",429);
   await quota(tx,userId);
   if(input.productId&&hasAssistantPermission(sender,"PRODUCT_VIEW")&&!await tx.product.findFirst({where:{id:input.productId,type:"WATCH"},select:{id:true}}))throw new AssistantError("Không tìm thấy watch đang xem.");
   let s=newConversation(null);s.messages=[{id:input.requestKey,role:"user",text:input.text}];s.title=input.text.slice(0,65);if(identityQuestion){const actor=await assistantActor(tx,userId);delete s.orderDraft;delete s.permissionRequest;s=message(s,accountReply(actor,actor.id===process.env.CUSTOMER_AI_PERMISSION_CONTACT_USER_ID),[]);}
   const created=await tx.customerAssistantConversation.create({data:{id:s.id,ownerId:userId,firstRequestKey:input.requestKey,...(identityQuestion?{status:"NEEDS_INFO"}:{}),state:json({...s,...(image?{pendingImage:image}:{}),screenHint,turnKeys:[input.requestKey],turnTimes:[new Date().toISOString()],pinnedProductId:hasAssistantPermission(sender,"PRODUCT_VIEW")?input.productId||null:null})}});return created.id;
 });return dto(await owned(prisma,id,userId));
}
export async function cancelAssistant(userId:string,id:string){await assistantActor(prisma,userId);return transaction(async tx=>{await lock(tx,id);const row=await owned(tx,id,userId);if(["QUEUED","RUNNING"].includes(row.status))await tx.customerAssistantConversation.update({where:{id},data:{status:row.approvedAt?"APPLIED":"CANCELLED",leaseToken:null,leaseExpiresAt:null,plan:row.approvedAt?undefined:Prisma.DbNull,state:json(message(withoutImage(state(row)),"Đã hủy lượt xử lý. Không giao thêm công việc."))}});return {ok:true};});}
async function leased(tx:Tx,id:string,token:string){const row=await tx.customerAssistantConversation.findFirst({where:{id,leaseToken:token,status:"RUNNING",leaseExpiresAt:{gt:new Date()}}});if(!row)throw new AssistantError("Lượt xử lý đã hết hiệu lực.",409);await assistantActor(tx,row.ownerId);return row;}
export async function assistantWorker(operation:string,body:Record<string,unknown>){
 if(operation==="claim")return transaction(async tx=>{
   const expired=await tx.customerAssistantConversation.findMany({where:{status:"RUNNING",leaseExpiresAt:{lt:new Date()}},take:20});for(const r of expired)await tx.customerAssistantConversation.update({where:{id:r.id},data:{status:r.approvedAt?"APPLIED":"FAILED",errorCode:"LEASE_EXPIRED",leaseToken:null,state:json(withoutImage(state(r)))}});
   const row=await tx.customerAssistantConversation.findFirst({where:{status:"QUEUED"},orderBy:{updatedAt:"asc"}});if(!row)return {run:null};
   let actor:Awaited<ReturnType<typeof assistantActor>>;try{actor=await assistantActor(tx,row.ownerId);}catch{await tx.customerAssistantConversation.update({where:{id:row.id},data:{status:row.approvedAt?"APPLIED":"FAILED",errorCode:"REQUESTER_UNAUTHORIZED",state:json(withoutImage(state(row)))}});return {run:null};}
   const currentState=state(row);
   if(currentState.pendingImage && (process.env.BEN_IMAGE_SEARCH_ENABLED!=="1" || !hasAssistantPermission(actor,"PRODUCT_VIEW") || body.imageInput!==true)){
     const next=message(withoutImage(currentState),"Ben chưa thể xử lý ảnh trong lượt này. Bạn có thể tìm bằng tên hoặc mã đồng hồ.");
     await tx.customerAssistantConversation.update({where:{id:row.id},data:{status:"FAILED",errorCode:"IMAGE_UNAVAILABLE",state:json(next)}});
     return {run:null};
   }
   if(currentState.pendingImage){
     const token=randomUUID();
     await tx.customerAssistantConversation.update({where:{id:row.id},data:{status:"RUNNING",leaseToken:token,leaseExpiresAt:new Date(Date.now()+120000)}});
     return {run:{id:row.id,leaseToken:token,imageBase64:currentState.pendingImage,text:JSON.stringify({
       currentUserMessage:currentState.messages.filter(m=>m.role==="user").at(-1),
       requester:{allowedLookups:BEN_IMAGE_LOOKUPS},
       imageSearch:true,
     })}};
   }
   const {screen:currentScreen,permissions:screenPermissions}=await resolveCurrentScreen(tx,actor,currentState.screenHint,currentState.messages.filter(m=>m.role==="user").at(-1)?.id);
   const previousRequest=hasAssistantPermission(actor,"PRODUCT_VIEW")&&hasAssistantPermission(actor,"TASK_VIEW")&&currentState.customerRequest&&readableRequest(currentState.customerRequest,actor)?await linkedRequest(tx,currentState.customerRequest,actor):null;
   const approvedRequests=hasAssistantPermission(actor,"PRODUCT_VIEW")&&hasAssistantPermission(actor,"TASK_VIEW")?await Promise.all((currentState.approvedRequests||[]).filter(r=>readableRequest(r.request,actor)).slice(-8).map(async r=>{const r2=await linkedRequest(tx,r.request,actor);return {revision:r.revision,reference:r2.reference,watch:r2.watch,conditions:r2.conditions.map(c=>({requirement:c.requirement.slice(0,250),progress:c.progress,outcome:c.outcome}))}})):[];
   const history=await authorizedHistory(tx,currentState,actor);
   const pendingOrder=hasAssistantPermission(actor,"ORDER_VIEW")&&hasAssistantPermission(actor,"PRODUCT_VIEW")&&(!currentState.orderDraft?.plan.customerId||hasAssistantPermission(actor,"CUSTOMER_VIEW"))?currentState.orderDraft:null;
   const createdOrders=hasAssistantPermission(actor,"ORDER_VIEW")?currentState.createdOrders||[]:[];
   const pendingPermissionRequest=await supportScopeVisible(tx,currentState,actor)?currentState.permissionRequest:null;
   const supportScope=pendingPermissionRequest?currentState.permissionRequestScope:undefined;
   const requests=[...(previousRequest?[previousRequest]:[]),...await Promise.all((currentState.approvedRequests||[]).filter(r=>readableRequest(r.request,actor)).slice(-8).map(r=>linkedRequest(tx,r.request,actor)))];
   // A model may repeat any supplied business information without doing a new lookup.
   const turnReadScope={permissions:[...new Set([...screenPermissions,...(pendingOrder?["ORDER_VIEW","PRODUCT_VIEW",...(pendingOrder.plan.customerId?["CUSTOMER_VIEW"]:[])]:[]),...(createdOrders.length?["ORDER_VIEW"]:[]),...(supportScope?.permissions||[]),...history.slice(-12).flatMap(m=>m.role==="assistant"?m.requiredPermissions||[]:[]),...requests.flatMap(r=>["PRODUCT_VIEW","TASK_VIEW",...(r.customer!=="Chưa gắn hồ sơ khách"?["CUSTOMER_VIEW"]:[]),...(r.conditions.some(c=>c.kind==="TECHNICAL"&&c.linkedRef)?["SERVICE_VIEW"]:[])])])],taskIds:[...new Set([...(supportScope?.taskIds||[]),...history.slice(-12).flatMap(m=>m.requiredTaskIds||[]),...requests.flatMap(r=>r.conditions.filter(c=>c.kind==="TASK"&&c.linkedRef).map(c=>c.linkedRef!))])]};
   const token=randomUUID();await tx.customerAssistantConversation.update({where:{id:row.id},data:{state:json({...currentState,turnReadScope,turnRepositoryAccess:history.slice(-12).some(m=>m.repositoryAccess)||(canReadRepository(actor)&&!!(currentState.codeJob||currentState.codeDraft))}),status:"RUNNING",leaseToken:token,leaseExpiresAt:new Date(Date.now()+120000)}});
   return {run:{id:row.id,leaseToken:token,text:JSON.stringify({interactionContractVersion:2,codeJob:canReadRepository(actor)&&currentState.codeJob?publicCodeJob(currentState.codeJob):null,codeDraft:canReadRepository(actor)?currentState.codeDraft||null:null,currentScreen,...workerHistory({...currentState,messages:history},actor),currentUserMessage:currentState.messages.filter(m=>m.role==="user").at(-1),screenProductHint:hasAssistantPermission(actor,"PRODUCT_VIEW")?currentState.pinnedProductId:null,previousRequest:previousRequest?{...previousRequest,original:undefined}:null,approvedRequests,alreadyApproved:!!row.approvedAt,pendingOrder,createdOrders,pendingPermissionRequest,permissionRequests:currentState.permissionRequests||[],requester:{repositoryRead:canReadRepository(actor)?{repository:BEN_REPOSITORY,commitSha:currentState.repositorySnapshot||process.env.BEN_REPOSITORY_COMMIT,readOnly:true}:null,navigationScreens:availableScreens(actor),...requesterIdentity(actor,actor.id===process.env.CUSTOMER_AI_PERMISSION_CONTACT_USER_ID),permissionSupportAvailable:!!await permissionContact(tx)&&actor.id!==process.env.CUSTOMER_AI_PERMISSION_CONTACT_USER_ID}}),referenceTime:new Date().toISOString(),timeZone:"Asia/Ho_Chi_Minh"}};
 });
 const id=String(body.id||""),token=String(body.leaseToken||"");
 if(!/^[a-f0-9-]{36}$/.test(id)||!/^[a-f0-9-]{36}$/.test(token))throw new AssistantError("Lượt xử lý không hợp lệ.");
 return transaction(async tx=>{
   const row=await leased(tx,id,token);
   if(operation==="heartbeat"){await tx.customerAssistantConversation.update({where:{id},data:{leaseExpiresAt:new Date(Date.now()+120000)}});return {active:true};}
   if(operation==="lookup"){
     const request=assistantLookupSchema.parse(body.lookup),entries=evidence(row),actor=await assistantActor(tx,row.ownerId);
     if(state(row).pendingImage && (process.env.BEN_IMAGE_SEARCH_ENABLED!=="1" || !BEN_IMAGE_LOOKUPS.some(tool=>tool===request.tool)))
       throw new AssistantError("Lượt tìm bằng ảnh chỉ tra cứu đồng hồ.",403);
     if(isRepositoryLookup(request)){
       if(!canReadRepository(actor)){
         if(entries.length>=16)throw new AssistantError("Đã hết lượt tra cứu.");
         const entry={request,result:{accessDenied:true,code:"REPOSITORY_ACCESS_DENIED",reason:"Chỉ tài khoản Long được cấu hình mới có quyền đọc repo; tính năng phải được bật riêng."}};
         await tx.customerAssistantConversation.update({where:{id},data:{evidence:json([...entries,entry])}});return {evidence:entry};
       }
       if(entries.length>=16)throw new AssistantError("Đã hết lượt tra cứu.");
       const snapshot=state(row).repositorySnapshot||process.env.BEN_REPOSITORY_COMMIT!;
       let result:Record<string,unknown>;
       try{result=await readRepository(request,snapshot,process.env.BEN_GITHUB_READ_TOKEN!);}catch{result={repository:BEN_REPOSITORY,commitSha:snapshot,readOnly:true,lookupRejected:true,reason:"Không đọc được phần mã được yêu cầu: kiểm tra cấu hình, quyền GitHub, đường dẫn hoặc giới hạn nội dung. Không có thao tác ghi nào được thực hiện."};}
       const entry={request,result};await tx.customerAssistantConversation.update({where:{id},data:{state:json({...state(row),repositorySnapshot:snapshot}),evidence:json([...entries,entry])}});return {evidence:entry};
     }
     if(!lookupAllowed(actor,request.tool)){await tx.customerAssistantConversation.update({where:{id},data:{state:json({...state(row),permissionDenied:true})}});return {evidence:{request,result:{accessDenied:true,reason:"Tài khoản hiện tại không có quyền thực hiện thao tác này. Không có dữ liệu nghiệp vụ được đọc."}}};}
     const prior=entries.find(e=>JSON.stringify(e.request)===JSON.stringify(request));if(!prior&&entries.length>=16)throw new AssistantError("Đã hết lượt tra cứu.");
     if(request.tool==="watches.images"&&!entries.some(e=>e.request.tool==="watches.search"&&Array.isArray(e.result.matches)&&(e.result.matches as {id:string}[]).some(m=>m.id===request.productId)))return {evidence:{request,result:{lookupRejected:true,reason:"Cần tìm sản phẩm trước khi xem ảnh; chỉ dùng ID có trong kết quả tìm kiếm."}}};
     if("productId" in request&&request.tool!=="watches.images"&&!hasUniqueEvidence(entries,"watches.search",request.productId))return {evidence:{request,result:{lookupRejected:true,reason:"Chưa xác định duy nhất đồng hồ. Nếu đang hỏi danh sách, trả danh sách tìm được; nếu cần thao tác cụ thể, hỏi lại người dùng để xác định watch. Không tự chọn một ID."}}};
     if("customerId" in request&&request.customerId&&!hasUniqueEvidence(entries,"customers.search",request.customerId))return {evidence:{request,result:{lookupRejected:true,reason:"Chưa xác định duy nhất hồ sơ khách. Hỏi lại nếu cần gắn hồ sơ; không tự chọn khách."}}};
     let result:Record<string,unknown>;
     if(request.tool==="navigation.open"){
       const latest=state(row).messages.filter(m=>m.role==="user").at(-1);
       result=resolveNavigation(request.query,request.intent,latest?.id,actor);
     }else if(request.tool==="watches.images"){
       const cards=await assistantProductCards(tx,[request.productId]);const card=cards[0];result=card?{productId:card.id,title:card.title,sku:card.sku,imageCount:card.images.length,displayedInChat:true}:{productId:request.productId,imageCount:0,displayedInChat:false};
     }else if(request.tool==="people.search"){
       const people=await tx.user.findMany({where:{isActive:true,OR:[{id:request.query},{name:{contains:request.query,mode:"insensitive"}}],roles:{some:{OR:[{name:"ADMIN"},{permissions:{some:{code:{in:["TASK_VIEW","TASK_MANAGE"]}}}}]}}},select:{id:true,name:true,roles:{select:{name:true,permissions:{where:{code:{in:["SERVICE_UPDATE","TASK_VIEW","TASK_MANAGE"]}},select:{code:true}}}}},take:7,orderBy:{id:"asc"}});
       result={matches:people.slice(0,6).map(p=>({id:p.id,name:p.name,canTechnical:p.roles.some(r=>r.name==="ADMIN"||r.permissions.some(p=>p.code==="SERVICE_UPDATE"))})),truncated:people.length>6};
     }else if(request.tool==="technical.catalog"){
       const actor=await assistantActor(tx,row.ownerId);if(!actor.admin&&!actor.permissions.has("SERVICE_VIEW"))result={matches:[],truncated:false,accessDenied:true};else{const matches=await tx.technicalDetailCatalog.findMany({where:{isActive:true,OR:[{id:request.query},{code:{equals:request.query,mode:"insensitive"}},{name:{contains:request.query,mode:"insensitive"}}]},select:{id:true,name:true,code:true,area:true,updatedAt:true},take:7,orderBy:{id:"asc"}});result={matches:matches.slice(0,6),truncated:matches.length>6};}
     }else{
       const actor=await assistantActor(tx,row.ownerId);if(request.tool==="accessories.search"&&!actor.admin&&!actor.permissions.has("ACCESSORY_VIEW"))result={matches:[],truncated:false,accessDenied:true};else {result=await executeIntakeLookup(tx,request);if(request.tool==="work.open")result={...result,followups:[],openWatchWork:(await Promise.all((result.openWatchWork as {id:string}[]).map(item=>visibleTask(tx,item.id,actor)))).filter((item):item is NonNullable<typeof item>=>!!item),caution:"Only visible tasks are shown; the server rechecks all conflicts privately at approval."};}
     }
     if(request.tool==="watches.search"||request.tool==="watches.detail")result=await withWatchReferencePrices(tx,request,result,actor);
     const entry={request,result};await tx.customerAssistantConversation.update({where:{id},data:{evidence:json(prior?entries.map(e=>e===prior?entry:e):[...entries,entry])}});return {evidence:entry};
   }
   if(operation!=="finish")throw new AssistantError("Lệnh không hợp lệ.");
   const navigationEntry=[...evidence(row)].reverse().find(e=>e.request.tool==="navigation.open");
   if(body.failed!==true&&navigationEntry&&(body.plan||body.orderPlan||body.permissionRequest||body.missingPermission||body.unsupportedCapability))throw new AssistantError("Navigation must be completed separately from business reviews or permission requests.");
   const failed=body.failed===true;let reply=typeof body.reply==="string"?body.reply.trim().slice(0,1500):"";if(!reply&&!failed)throw new AssistantError("Thiếu câu trả lời.");
   const actor=await assistantActor(tx,row.ownerId);
   if(state(row).pendingImage){
     const allowed=process.env.BEN_IMAGE_SEARCH_ENABLED==="1"&&hasAssistantPermission(actor,"PRODUCT_VIEW");
     const s=withoutImage(state(row));
     delete s.orderDraft;delete s.customerRequest;delete s.permissionRequest;delete s.permissionRequestScope;delete s.codeDraft;delete s.turnReadScope;delete s.turnRepositoryAccess;
     const matches=evidence(row).some(entry=>entry.request.tool==="watches.search"&&Array.isArray(entry.result.matches)&&entry.result.matches.length>0);
     const next=message(s,!allowed?"Quyền xem sản phẩm đã thay đổi. Ben không thể trả kết quả.":failed?"Ben chưa phân tích được ảnh. Bạn thử gửi lại ảnh rõ hơn nhé.":!matches?"Ben chưa tìm được ứng viên trong kho. Bạn có thể gửi ảnh rõ logo, mặt số hoặc mã ở nắp đáy.":reply,allowed?["PRODUCT_VIEW"]:[]);
     if(allowed&&!failed&&matches){
       const ids=evidence(row).flatMap(entry=>entry.request.tool==="watches.images"&&Number(entry.result.imageCount)>0?[entry.request.productId]:[]);
       if(ids.length)next.messages[next.messages.length-1].imageProductIds=[...new Set(ids)].slice(0,6);
     }
     await tx.customerAssistantConversation.update({where:{id},data:{state:json(next),status:failed?"FAILED":"NEEDS_INFO",plan:Prisma.DbNull,errorCode:failed?"GENERATION_FAILED":null,leaseToken:null,leaseExpiresAt:null}});
     return {accepted:true};
   }
   const repositoryEntries=evidence(row).filter(e=>e.request.tool.startsWith("repository."));
   const codeScope=repositoryEntries.length>0||state(row).turnRepositoryAccess;
   if(repositoryEntries.length||(codeScope&&!canReadRepository(actor))){
     const permitted=canReadRepository(actor),s=state(row);delete s.turnRepositoryAccess;delete s.orderDraft;delete s.permissionRequest;delete s.permissionRequestScope;delete s.customerRequest;
     const hasRead=repositoryEntries.some(e=>!e.result.lookupRejected&&!e.result.accessDenied);
     const mixed=body.plan||body.orderPlan||body.permissionRequest||evidence(row).some(e=>e.request.tool==="navigation.open");
     const next=message(s,!permitted?"Hiện tài khoản hoặc cấu hình chưa cho phép đọc repository. Mình chưa thể trả nội dung repo.":failed?"Lượt đọc repo chưa hoàn tất. Chưa có code nào được sửa.":mixed?"Bước này chỉ đọc và phân tích code. Mình chưa sửa mã, tạo đơn, giao việc hay điều hướng từ phân tích này.":!hasRead?"Mình chưa đọc được mã nguồn nên chưa thể xác nhận nguyên nhân hoặc phạm vi sửa. Cần kiểm tra cấu hình GitHub và đường dẫn được phép.":reply,[]);
     delete next.codeDraft;
     if(body.codePlan&&!failed&&permitted&&!mixed){
       const ready=codeEnabled(actor)&&repositoryEntries.some(e=>e.request.tool==="repository.file"&&!e.result.lookupRejected);
       if(ready){const plan=codePlanSchema.parse(body.codePlan);next.codeDraft={...plan,revision:row.revision,baseSha:s.repositorySnapshot||process.env.BEN_REPOSITORY_COMMIT!,baseRef:process.env.BEN_CODE_BASE_REF!,prBase:process.env.BEN_CODE_PR_BASE||"main"};next.messages[next.messages.length-1].text="Mình đã chuẩn bị yêu cầu sửa code. Bạn duyệt trước khi worker bắt đầu nhé.";}
       else next.messages[next.messages.length-1].text="Cần bật luồng sửa code cho Long và đọc file liên quan trước khi giao chạy.";
     }
     if(permitted){const m=next.messages[next.messages.length-1];m.repositoryAccess=true;m.repositorySources=repositoryEntries.filter(e=>typeof e.result.commitSha==="string"&&!e.result.lookupRejected).slice(-6).map(e=>({commitSha:String(e.result.commitSha),...(typeof e.result.path==="string"?{path:e.result.path}:{}),...(typeof e.result.url==="string"?{url:e.result.url,startLine:Number(e.result.startLine),endLine:Number(e.result.endLine)}:{})}));}
     await tx.customerAssistantConversation.update({where:{id},data:{state:json(next),status:failed?"FAILED":"NEEDS_INFO",plan:Prisma.DbNull,errorCode:failed?"GENERATION_FAILED":null,leaseToken:null,leaseExpiresAt:null}});return {accepted:true};
   }
   if(body.codePlan)throw new AssistantError("Cần đọc code trước khi chuẩn bị yêu cầu sửa.",409);
   const inherited=state(row).turnReadScope||{permissions:[],taskIds:[]};
   const required=[...new Set([...inherited.permissions,...evidence(row).flatMap(e=>LOOKUP_PERMISSIONS[e.request.tool]||[])])];
   const scopedTaskIds=[...new Set([...inherited.taskIds,...evidence(row).flatMap(e=>e.request.tool==="work.open"?(e.result.openWatchWork as {id:string}[]||[]).map(t=>t.id):[])])];
   const scopeRevoked=!hasAssistantPermission(actor,"TASK_VIEW_ALL")&&(await Promise.all(scopedTaskIds.map(id=>visibleTask(tx,id,actor)))).some(t=>!t);
   const revoked=scopeRevoked||required.some(p=>!hasAssistantPermission(actor,p));
   if(revoked)reply="Quyền của bạn đã thay đổi trong lúc xử lý. Mình chưa thể trả dữ liệu hoặc thực hiện thao tác đó; bạn có thể tiếp tục trao đổi.";
   let plan:AssistantPlan|undefined,request:CustomerRequest|undefined;let support=body.permissionRequest==null?undefined:permissionSummary.parse(body.permissionRequest);if(body.plan&&support)throw new AssistantError("Không thể gộp hỗ trợ quyền và giao việc nghiệp vụ.");
   if(!failed&&!revoked&&!row.approvedAt&&body.plan){plan=assistantPlanSchema.parse(body.plan);const denied=planDeniedReason(actor,plan);
     if(denied){plan=undefined;reply=denied;support=state(row).messages.filter(m=>m.role==="user").at(-1)?.text.slice(0,1000);}
     else if(!planHasEvidence(plan,evidence(row))){plan=undefined;reply="Mình chưa xác minh đủ watch, danh mục hoặc người nhận (và hồ sơ khách nếu có gắn). Bạn cho mình thông tin cụ thể để tránh chọn nhầm nhé.";}
     else request=await requestFromPlan(tx,row,plan);
   }
   if(plan)reply="Mình đề xuất giao các việc bên dưới. Bạn duyệt trước khi thực hiện nhé.";
   if(row.approvedAt&&body.plan)reply="Các việc đã giao không tự sửa qua chat. Bạn mở phiếu/task liên quan để thực hiện thay đổi theo luồng hiện có nhé.";
   const s=state(row);delete s.turnReadScope;delete s.permissionRequest;delete s.permissionRequestScope;delete s.orderDraft;
   let orderDraft:State["orderDraft"];
   const missingPermission=typeof body.missingPermission==="string"&&Object.values(PERMISSIONS).includes(body.missingPermission as typeof PERMISSIONS[keyof typeof PERMISSIONS])&&!hasAssistantPermission(actor,body.missingPermission);
   let verifiedDenial=!!s.permissionDenied||revoked||!!(body.plan&&!plan);
   if(!failed&&!revoked&&body.orderPlan){if(body.plan||support)throw new AssistantError("Mỗi lượt chỉ có một bản duyệt.");const order=assistantOrderSchema.parse(body.orderPlan),denied=orderDeniedPermission(actor,order);if(denied){verifiedDenial=true;support=s.messages.filter(m=>m.role==="user").at(-1)?.text.slice(0,1000);}else{try{orderDraft=await prepareOrder(tx,order,row.revision,evidence(row));}catch(error){if(error instanceof AssistantError)reply=error.message;else throw error;}}}
   if(revoked||s.permissionDenied){support=s.messages.filter(m=>m.role==="user").at(-1)?.text.slice(0,1000);}
   if(!failed&&support){
    plan=undefined;request=undefined;orderDraft=undefined;
    const contact=await permissionContact(tx);
    if(!verifiedDenial&&!missingPermission){support=undefined;reply=(actor.id===process.env.CUSTOMER_AI_PERMISSION_CONTACT_USER_ID?"Bạn đang đăng nhập là Long. ":"")+"Ben chưa hỗ trợ thao tác này qua chat; đây là giới hạn của Ben, không có nghĩa tài khoản của bạn thiếu quyền. Bạn có thể mở màn hình chức năng tương ứng để xử lý.";}
    else if(actor.id===process.env.CUSTOMER_AI_PERMISSION_CONTACT_USER_ID){support=undefined;reply="Bạn đang đăng nhập là Long. Ben không tạo yêu cầu quyền hạn gửi cho chính bạn. "+(actor.admin?"Bạn có thể kiểm tra và điều chỉnh quyền ở màn hình quản trị.":"Tài khoản hiện tại chưa có quyền thực hiện thao tác này; cần kiểm tra cấu hình phân quyền.");}
    if(support){
    reply=(revoked?"Quyền của bạn đã thay đổi trong lúc xử lý.":"Yêu cầu này nằm ngoài phạm vi quyền hạn hiện tại của bạn.")+" "+LONG_SUPPORT_OFFER;
    if(contact){s.permissionRequest={summary:support,revision:row.revision};s.permissionRequestScope=revoked?{permissions:[],taskIds:[]}:{permissions:required,taskIds:scopedTaskIds};}
    else reply+=" Hiện chưa thể tạo công việc qua Ben; bạn liên hệ Long trực tiếp nhé.";
    }
   }
   if(orderDraft){s.orderDraft=orderDraft;plan=undefined;request=undefined;reply="Mình đã chuẩn bị đơn nháp bên dưới. Bạn kiểm tra và duyệt trước khi tạo; đơn nháp sẽ giữ đồng hồ theo quy tắc hệ thống.";}
   const navigationResult=!failed&&navigationEntry?.request.tool==="navigation.open"?resolveNavigation(navigationEntry.request.query,navigationEntry.request.intent,s.messages.filter(m=>m.role==="user").at(-1)?.id,actor):undefined;
   if(navigationResult?.allowed&&navigationEntry?.result.allowed!==true){navigationResult.allowed=false;navigationResult.code="RETRY_REQUIRED";navigationResult.reason="Yêu cầu trước chưa được chấp nhận. Bạn gửi lại yêu cầu mở màn hình nhé.";}
   if(navigationResult&&!revoked)reply=navigationResult.reason;
   const next=message(s,failed?"Codex chưa hoàn tất lượt này. Bạn có thể nhắn lại để thử tiếp; chưa giao thêm việc.":reply,revoked||support?[]:orderDraft?[...new Set([...required,...orderPermissions(orderDraft.plan)])]:required);
   if(navigationResult&&!revoked&&navigationEntry?.request.tool==="navigation.open"){const m=next.messages[next.messages.length-1];m.navigationResult={code:navigationResult.code};if(navigationResult.allowed){m.navigationKey=navigationEntry!.request.query;m.navigationRequestKey=s.messages.filter(m=>m.role==="user").at(-1)?.id;}}
   if(codeScope&&canReadRepository(actor))next.messages[next.messages.length-1].repositoryAccess=true;
   delete next.turnRepositoryAccess;
   if(!failed&&!revoked&&!support&&scopedTaskIds.length)next.messages[next.messages.length-1].requiredTaskIds=scopedTaskIds;
   if(!failed&&!revoked&&hasAssistantPermission(actor,"PRODUCT_VIEW")){const ids=evidence(row).flatMap(e=>e.request.tool==="watches.images"&&Number(e.result.imageCount)>0?[e.request.productId]:[]);if(ids.length)next.messages[next.messages.length-1].imageProductIds=[...new Set(ids)].slice(0,6);}
   if(!row.approvedAt){if(request&&plan){next.customerRequest=request;next.context=null;}else delete next.customerRequest;}
   await tx.customerAssistantConversation.update({where:{id},data:{state:json(next),status:row.approvedAt?"APPLIED":failed?"FAILED":plan||orderDraft?"DRAFT":"NEEDS_INFO",plan:row.approvedAt?undefined:plan?json(plan):Prisma.DbNull,errorCode:failed?"GENERATION_FAILED":null,leaseToken:null,leaseExpiresAt:null}});return {accepted:true};
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
   const detail=entries.find(e=>e.request.tool==="watches.detail"&&e.request.productId===plan.productId),now=await executeIntakeLookup(tx,{tool:"watches.detail",productId:plan.productId});
   if(!detail||now.id!==plan.productId||["sku","title"].some(k=>now[k]!==detail.result[k]))throw new AssistantError("Thông tin nhận diện đồng hồ đã thay đổi. Nhắn lại để Ben cập nhật đề xuất.",409);
   if(plan.customerId){
   const observed=entries.filter(e=>e.request.tool==="customers.search").flatMap(e=>e.result.matches as {id:string;version:string}[]||[]).find(c=>c.id===plan.customerId),customer=await tx.customer.findUnique({where:{id:plan.customerId},select:{updatedAt:true}});
   if(!customer||customer.updatedAt.toISOString()!==observed?.version)throw new AssistantError("Khách đã thay đổi sau khi tra cứu. Cần cập nhật đề xuất.",409);
   }
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
export async function approveAssistantOrder(userId:string,id:string,revision:number,defer:(work:()=>Promise<void>)=>void){
 const initial=await owned(prisma,id,userId),actor=await assistantActor(prisma,userId),snapshot=state(initial);
 if(snapshot.createdOrders?.some(o=>o.revision===revision))return dto(initial);
 if(initial.revision!==revision||initial.status!=="DRAFT"||snapshot.orderDraft?.revision!==revision)throw new AssistantError("Bản đơn đã thay đổi. Hãy xem lại trước khi tạo.",409);
 const plan=assistantOrderSchema.parse(snapshot.orderDraft.plan),denied=orderDeniedPermission(actor,plan);if(denied)throw new AssistantError("Tài khoản chưa có quyền tạo đơn nháp này.",403);
 let updated:CustomerAssistantConversation|undefined;
 class Replay extends Error{}
 try{
  await createOrderWithItems({customerId:plan.customerId,customerName:plan.customerName,shipPhone:plan.phone,hasShipment:plan.hasShipment,shipAddress:plan.address,shipCity:plan.city,shipDistrict:plan.district,shipWard:plan.ward,paymentMethod:plan.paymentMethod,notes:plan.notes,status:"DRAFT",source:"ADMIN",verificationStatus:"VERIFIED",reserve:{type:"NONE"},items:snapshot.orderDraft.items.map(i=>({kind:"PRODUCT",productId:i.id,title:i.title,quantity:1,listPrice:0,unitPriceAgreed:i.price}))},{deferConsumers:defer},{
   preserveCustomerProfile:true,actorUserId:userId,
   beforeCreate:async tx=>{
    await lock(tx,id);const current=await owned(tx,id,userId),currentActor=await assistantActor(tx,userId),s=state(current);
    if(s.createdOrders?.some(o=>o.revision===revision)){updated=current;throw new Replay();}
    if(current.revision!==revision||current.status!=="DRAFT"||s.orderDraft?.revision!==revision||JSON.stringify(assistantOrderSchema.parse(s.orderDraft.plan))!==JSON.stringify(plan))throw new AssistantError("Bản đơn đã thay đổi. Hãy xem lại trước khi tạo.",409);
    if(orderDeniedPermission(currentActor,plan))throw new AssistantError("Quyền của bạn đã thay đổi; chưa tạo đơn.",403);
    if(plan.customerId)await tx.$queryRaw`SELECT "id" FROM "Customer" WHERE "id"=${plan.customerId} FOR UPDATE`;
    if(!plan.customerId&&plan.phone)await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`ben-customer-phone:${plan.phone}`}, 0))`;
    for(const productId of plan.items.map(i=>i.productId).sort()){
     await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${`order-product:${productId}`}, 0))`;
     await tx.$queryRaw`SELECT "id" FROM "Product" WHERE "id"=${productId} FOR UPDATE`;
    }
    await prepareOrder(tx,plan,revision,evidence(current));
   },
   afterCreate:async(tx,result)=>{
    const current=await owned(tx,id,userId),s=state(current);s.createdOrders=[...(s.createdOrders||[]),{revision,id:result.id,reference:result.refNo||result.id}];delete s.orderDraft;
    updated=await tx.customerAssistantConversation.update({where:{id},data:{state:json(message(s,`Đã tạo đơn nháp ${result.refNo||result.id}. Đồng hồ được giữ theo quy tắc đơn hàng; chưa ghi nhận thu tiền hay giao hàng.`,["ORDER_VIEW"])),status:"NEEDS_INFO",plan:Prisma.DbNull}});
   },
  });
 }catch(error){if(!(error instanceof Replay))throw error;}
 if(!updated)throw new AssistantError("Chưa xác nhận được kết quả. Hãy tải lại cuộc trao đổi.",409);
 return dto(updated);
}
export async function approvePermissionSupport(userId:string,id:string,revision:number,defer:(work:()=>Promise<void>)=>void){
 const completed=await transaction(async tx=>{
  await lock(tx,id);const row=await owned(tx,id,userId),actor=await assistantActor(tx,userId),s=state(row);
  if(s.permissionRequests?.some(r=>r.revision===revision))return {row,work:[]};
  if(["QUEUED","RUNNING"].includes(row.status)||row.revision!==revision||s.permissionRequest?.revision!==revision)throw new AssistantError("Bản yêu cầu hỗ trợ đã thay đổi. Hãy xem lại trước khi gửi.",409);
  if(!await supportScopeVisible(tx,s,actor))throw new AssistantError("Quyền đã thay đổi. Hãy nhắn lại để chuẩn bị yêu cầu hỗ trợ phù hợp.",403);
  const contact=await permissionContact(tx);if(actor.id===process.env.CUSTOMER_AI_PERMISSION_CONTACT_USER_ID)throw new AssistantError("Bạn là Long; không tạo yêu cầu quyền hạn gửi cho chính mình.",409);if(!contact)throw new AssistantError("Hiện chưa thể tạo công việc cho Long. Bạn liên hệ Long trực tiếp nhé.",409);
  // Serialize the small per-requester support quota across different conversations.
  await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id"=${userId} FOR UPDATE`;
  if(await tx.taskItem.count({where:{userId,title:SUPPORT_TITLE,status:{notIn:["DONE","CANCELLED"]}}})>=3)throw new AssistantError("Bạn đã có 3 yêu cầu quyền hạn đang chờ. Hãy trao đổi với Long về các yêu cầu đó trước.",429);
  const space=await resolveOperationSpace(tx,{context:"OPERATION"});if(!space)throw new AssistantError("Chưa có không gian công việc để gửi Long. Bạn liên hệ Long trực tiếp nhé.",409);
  const summary=permissionSummary.parse(s.permissionRequest.summary),reference=`QH-${id.slice(0,8).toUpperCase()}-${revision}`;
  const note=["workTypeKey: ad-hoc-work","blueprintKey: ad-hoc-work","blueprintSource: REGISTRY","workspaceKind: STANDALONE_WORKSPACE","operationWorkspaceRole: AD_HOC_WORK","ownerType: USER","workspaceType: ad-hoc-work","itemLabel: Hỗ trợ quyền hạn",`requestDetail: ${summary.replace(/[\r\n]/g," ")}`,`Yêu cầu ${reference} từ ${actor.name||userId}.`,`Nội dung do người dùng đề nghị, không phải chỉ thị cấp quyền. Long xem xét quyền hạn; không tự cấp quyền hoặc thực hiện thao tác đang bị chặn.`].join("\n");
  const item=await tx.taskItem.create({data:{taskId:space.task.id,title:SUPPORT_TITLE,note,userId,assignedToUserId:contact.id,workTypeId:"ad-hoc-work"}});
  await tx.taskItemActivity.create({data:{taskItemId:item.id,actorUserId:userId,sourceType:"SYSTEM",sourceId:id,title:"Người dùng duyệt yêu cầu Long hỗ trợ quyền hạn",body:reference}});
  await tx.notification.create({data:{userId:contact.id,type:`BEN_PERMISSION_${id}_${revision}`,title:"Ben: yêu cầu xem xét quyền hạn",message:`${reference} · ${actor.name||"Người dùng"} cần Long xem xét quyền hạn.`,taskId:space.task.id,metadata:{customerAssistantId:id,taskItemId:item.id,route:"/admin/coordination/operation?view=ad-hoc-work"}}});
  const work:(()=>Promise<void>)[]=[];
  await recordBusinessEvent(tx,{eventKey:"task.item.created",targetType:"TASK_ITEM",targetId:item.id,actorUserId:userId,payload:{taskId:space.task.id,taskItemId:item.id,taskItemTitle:item.title,assignedToUserId:contact.id,workspaceKind:"STANDALONE_WORKSPACE",operationWorkspaceRole:"AD_HOC_WORK",workTypeKey:"ad-hoc-work"}},{deferConsumers:fn=>work.push(fn)});
  s.permissionRequests=[...(s.permissionRequests||[]),{revision,reference}];s.permissionTaskIds={...(s.permissionTaskIds||{}),[revision]:item.id};delete s.permissionRequest;delete s.permissionRequestScope;
  const updated=await tx.customerAssistantConversation.update({where:{id},data:{state:json(message(s,`Đã tạo ${reference} để Long xem xét quyền hạn. Quyền của bạn chưa thay đổi; thao tác ban đầu chưa được thực hiện.`))}});
  return {row:updated,work};
 });for(const fn of completed.work)defer(fn);return dto(completed.row);
}
export async function recordConditionOutcome(userId:string,id:string,conditionId:string,outcome:string,result:string,requestRevision?:number){
 const actor=await assistantActor(prisma,userId);if(!hasAssistantPermission(actor,"TASK_MANAGE"))throw new AssistantError("Bạn chưa có quyền cập nhật kết quả công việc.",403);return transaction(async tx=>{await lock(tx,id);const row=await owned(tx,id,userId);const currentActor=await assistantActor(tx,userId);if(!hasAssistantPermission(currentActor,"TASK_MANAGE"))throw new AssistantError("Bạn chưa có quyền cập nhật kết quả công việc.",403);if(["QUEUED","RUNNING"].includes(row.status))throw new AssistantError("Chưa thể cập nhật kết quả lúc này.",409);const s=state(row);const request=requestRevision!==undefined?s.approvedRequests?.find(r=>r.revision===requestRevision)?.request:row.approvedAt?s.customerRequest:undefined;if(!request?.conditions.some(c=>c.id===conditionId))throw new AssistantError("Không tìm thấy điều kiện đã duyệt.");request.conditions=request.conditions.map(c=>c.id===conditionId?{...c,outcome,result}:c);if(row.approvedRevision===requestRevision)s.customerRequest=request;await tx.customerAssistantConversation.update({where:{id},data:{state:json(s)}});return {ok:true};});
}
