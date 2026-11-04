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
import { newConversation, type Conversation } from "../simulation";
import type { CustomerRequest } from "../customer-request";
import { AssistantError, assistantActor, assistantRecipient } from "./access";

type State=Conversation & { turnKeys?:string[]; turnTimes?:string[]; pinnedProductId?:string|null };
const json=(value:unknown)=>JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
const state=(row:CustomerAssistantConversation)=>row.state as unknown as State;
const evidence=(row:CustomerAssistantConversation)=>row.evidence as unknown as Evidence[];
async function transaction<T>(fn:(tx:Tx)=>Promise<T>):Promise<T>{for(let attempt=0;;attempt++){try{return await prisma.$transaction(fn,{isolationLevel:"Serializable",timeout:45000,maxWait:10000});}catch(e){if(attempt<3&&e instanceof Prisma.PrismaClientKnownRequestError&&(["P2034","P2002"].includes(e.code)||(e.code==="P2010"&&["40001","40P01"].includes(String(e.meta?.code))))){await new Promise(resolve=>setTimeout(resolve,10*(attempt+1)));continue;}throw e;}}}
async function owned(db:DB,id:string,userId:string){const row=await db.customerAssistantConversation.findFirst({where:{id,ownerId:userId}});if(!row)throw new AssistantError("Không có quyền xem cuộc trao đổi này.",403);return row;}
async function lock(tx:Tx,id:string){await tx.$queryRaw`SELECT "id" FROM "CustomerAssistantConversation" WHERE "id"=${id} FOR UPDATE`;}
async function quota(tx:Tx,userId:string){const since=Date.now()-3600000;const configured=Number(process.env.CUSTOMER_AI_MAX_TURNS_PER_HOUR||30);const max=Number.isInteger(configured)&&configured>=1&&configured<=100?configured:30;const rows=await tx.customerAssistantConversation.findMany({where:{ownerId:userId,updatedAt:{gte:new Date(since)}},select:{state:true},take:101});const count=rows.reduce((sum,r)=>sum+((r.state as unknown as State).turnTimes||[]).filter(t=>new Date(t).getTime()>=since).length,0);if(rows.length>100||count>=max)throw new AssistantError("Bạn đã dùng hết lượt trợ lý trong giờ này. Hãy thử lại sau.",429);}
function message(s:State,text:string){return {...s,messages:[...s.messages,{id:randomUUID(),role:"assistant" as const,text}]};}
async function linkedRequest(db:DB,r:CustomerRequest,canReadTechnical:boolean){
 const request=structuredClone(r);const labels:Record<string,string>={OPEN:"Chờ tiếp nhận",TODO:"Chờ tiếp nhận",READY:"Sẵn sàng",IN_PROGRESS:"Đang xử lý",PROCESSING:"Đang xử lý",DONE:"Hoàn tất",COMPLETED:"Hoàn tất",CANCELLED:"Đã hủy",CANCELED:"Đã hủy"};
 for(const c of request.conditions){
  if(c.kind==="TECHNICAL"){
   if(!canReadTechnical){c.progress="Không có quyền xem phiếu kỹ thuật";delete c.linkedHref;continue;}
   const issue=await db.technicalIssue.findUnique({where:{id:c.linkedRef!},select:{executionStatus:true,resolutionNote:true,serviceRequestId:true}});
   if(issue){c.progress=labels[issue.executionStatus]||issue.executionStatus;c.result=c.result||issue.resolutionNote||"";c.linkedHref="/admin/services/issues-board?serviceRequestId="+encodeURIComponent(issue.serviceRequestId);}else c.progress="Không tìm thấy phiếu liên quan";
  }else{const item=await db.taskItem.findUnique({where:{id:c.linkedRef!},select:{status:true}});if(item){c.progress=labels[item.status]||item.status;c.linkedHref="/admin/coordination/operation?view=ad-hoc-work";}else c.progress="Không tìm thấy task liên quan";}
 }return request;
}
async function dto(row:CustomerAssistantConversation,canReadTechnical?:boolean,refreshLinks=true){
 const s=structuredClone(state(row));if(canReadTechnical===undefined){const actor=await assistantActor(prisma,row.ownerId);canReadTechnical=actor.admin||actor.permissions.has("SERVICE_VIEW");}
 if(refreshLinks&&row.approvedAt&&s.customerRequest)s.customerRequest=await linkedRequest(prisma,s.customerRequest,canReadTechnical);
 return {...s,updatedAt:row.updatedAt.toISOString(),revision:row.revision,runStatus:row.status,errorCode:row.errorCode,approved:!!row.approvedAt};
}
export async function listAssistant(userId:string,id?:string){const actor=await assistantActor(prisma,userId);const rows=id?[await owned(prisma,id,userId)]:await prisma.customerAssistantConversation.findMany({where:{ownerId:userId},orderBy:{updatedAt:"desc"},take:20});return {partial:!!id,conversations:await Promise.all(rows.map(row=>dto(row,actor.admin||actor.permissions.has("SERVICE_VIEW"),!!id)))};}
export async function sendAssistant(userId:string,input:{id?:string;requestKey:string;text:string;productId?:string|null}){
 await assistantActor(prisma,userId);
 const id=await transaction(async tx=>{
   let row=input.id?await owned(tx,input.id,userId):await tx.customerAssistantConversation.findUnique({where:{firstRequestKey:input.requestKey}});
   if(row){await lock(tx,row.id);row=await owned(tx,row.id,userId);const s=state(row);if((s.turnKeys||[]).includes(input.requestKey)){if(s.messages.find(m=>m.id===input.requestKey)?.text!==input.text)throw new AssistantError("Mã tin nhắn đã được dùng với nội dung khác.",409);return row.id;}
     if(["QUEUED","RUNNING"].includes(row.status))throw new AssistantError("Đang xử lý tin trước. Bạn có thể hủy hoặc đợi kết quả.",409);
     if(input.productId&&s.pinnedProductId&&input.productId!==s.pinnedProductId)throw new AssistantError("Cuộc trao đổi đã ghim watch khác. Hãy tạo cuộc mới.",409);
     if(s.messages.length>=38)throw new AssistantError("Cuộc trao đổi đã dài. Hãy tạo cuộc mới.",409);
     await quota(tx,userId);
     const next={...s,messages:[...s.messages,{id:input.requestKey,role:"user",text:input.text}],turnKeys:[...(s.turnKeys||[]),input.requestKey],turnTimes:[...(s.turnTimes||[]),new Date().toISOString()]};
     await tx.customerAssistantConversation.update({where:{id:row.id},data:{state:json(next),status:"QUEUED",revision:{increment:1},evidence:[],plan:row.approvedAt?undefined:Prisma.DbNull,errorCode:null,leaseToken:null,leaseExpiresAt:null}});return row.id;
   }
   if(await tx.customerAssistantConversation.count({where:{ownerId:userId,status:{in:["QUEUED","RUNNING"]}}})>=3)throw new AssistantError("Bạn đang có 3 yêu cầu chờ.",429);
   await quota(tx,userId);
   if(input.productId&&!await tx.product.findFirst({where:{id:input.productId,type:"WATCH"},select:{id:true}}))throw new AssistantError("Không tìm thấy watch đang xem.");
   const context={kind:input.productId?"watches":"list",label:input.productId?"Sản phẩm đang xem":"Sản phẩm",href:input.productId?`/admin/watches/${input.productId}`:"/admin/watches",...(input.productId?{id:input.productId}:{})};
   const s=newConversation(context);s.messages=[{id:input.requestKey,role:"user",text:input.text}];s.title=input.text.slice(0,65);
   const created=await tx.customerAssistantConversation.create({data:{id:s.id,ownerId:userId,firstRequestKey:input.requestKey,state:json({...s,turnKeys:[input.requestKey],turnTimes:[new Date().toISOString()],pinnedProductId:input.productId||null})}});return created.id;
 });return dto(await owned(prisma,id,userId));
}
export async function cancelAssistant(userId:string,id:string){await assistantActor(prisma,userId);return transaction(async tx=>{await lock(tx,id);const row=await owned(tx,id,userId);if(["QUEUED","RUNNING"].includes(row.status))await tx.customerAssistantConversation.update({where:{id},data:{status:row.approvedAt?"APPLIED":"CANCELLED",leaseToken:null,leaseExpiresAt:null,plan:row.approvedAt?undefined:Prisma.DbNull,state:json(message(state(row),"Đã hủy lượt xử lý. Không giao thêm công việc."))}});return {ok:true};});}
async function leased(tx:Tx,id:string,token:string){const row=await tx.customerAssistantConversation.findFirst({where:{id,leaseToken:token,status:"RUNNING",leaseExpiresAt:{gt:new Date()}}});if(!row)throw new AssistantError("Lượt xử lý đã hết hiệu lực.",409);await assistantActor(tx,row.ownerId);return row;}
export async function assistantWorker(operation:string,body:Record<string,unknown>){
 if(operation==="claim")return transaction(async tx=>{
   const expired=await tx.customerAssistantConversation.findMany({where:{status:"RUNNING",leaseExpiresAt:{lt:new Date()}},take:20});for(const r of expired)await tx.customerAssistantConversation.update({where:{id:r.id},data:{status:r.approvedAt?"APPLIED":"FAILED",errorCode:"LEASE_EXPIRED",leaseToken:null}});
   const row=await tx.customerAssistantConversation.findFirst({where:{status:"QUEUED"},orderBy:{updatedAt:"asc"}});if(!row)return {run:null};
   let actor:Awaited<ReturnType<typeof assistantActor>>;try{actor=await assistantActor(tx,row.ownerId);}catch{await tx.customerAssistantConversation.update({where:{id:row.id},data:{status:row.approvedAt?"APPLIED":"FAILED",errorCode:"REQUESTER_UNAUTHORIZED"}});return {run:null};}
   const previousRequest=row.approvedAt&&state(row).customerRequest?await linkedRequest(tx,state(row).customerRequest!,actor.admin||actor.permissions.has("SERVICE_VIEW")):state(row).customerRequest||null;
   const token=randomUUID();await tx.customerAssistantConversation.update({where:{id:row.id},data:{status:"RUNNING",leaseToken:token,leaseExpiresAt:new Date(Date.now()+120000)}});
   return {run:{id:row.id,leaseToken:token,text:JSON.stringify({messages:state(row).messages,productId:state(row).pinnedProductId,previousRequest,alreadyApproved:!!row.approvedAt,requester:{id:row.ownerId,name:actor.name,canCreateTechnical:actor.admin||["SERVICE_VIEW","SERVICE_CREATE"].every(p=>actor.permissions.has(p))}}),referenceTime:new Date().toISOString(),timeZone:"Asia/Ho_Chi_Minh"}};
 });
 const id=String(body.id||""),token=String(body.leaseToken||"");
 if(!/^[a-f0-9-]{36}$/.test(id)||!/^[a-f0-9-]{36}$/.test(token))throw new AssistantError("Lượt xử lý không hợp lệ.");
 return transaction(async tx=>{
   const row=await leased(tx,id,token);
   if(operation==="heartbeat"){await tx.customerAssistantConversation.update({where:{id},data:{leaseExpiresAt:new Date(Date.now()+120000)}});return {active:true};}
   if(operation==="lookup"){
     const request=assistantLookupSchema.parse(body.lookup),entries=evidence(row);const prior=entries.find(e=>JSON.stringify(e.request)===JSON.stringify(request));if(prior)return {evidence:prior};if(entries.length>=16)throw new AssistantError("Đã hết lượt tra cứu.");
     if("productId" in request&&!hasUniqueEvidence(entries,"watches.search",request.productId))throw new AssistantError("Cần xác minh watch trước.");
     if("customerId" in request&&!hasUniqueEvidence(entries,"customers.search",request.customerId))throw new AssistantError("Cần xác minh khách trước.");
     let result:Record<string,unknown>;
     if(request.tool==="people.search"){
       const people=await tx.user.findMany({where:{isActive:true,OR:[{id:request.query},{name:{contains:request.query,mode:"insensitive"}}],roles:{some:{OR:[{name:"ADMIN"},{permissions:{some:{code:{in:["TASK_VIEW","TASK_MANAGE"]}}}}]}}},select:{id:true,name:true,roles:{select:{name:true,permissions:{where:{code:{in:["SERVICE_UPDATE","TASK_VIEW","TASK_MANAGE"]}},select:{code:true}}}}},take:7,orderBy:{id:"asc"}});
       result={matches:people.slice(0,6).map(p=>({id:p.id,name:p.name,canTechnical:p.roles.some(r=>r.name==="ADMIN"||r.permissions.some(p=>p.code==="SERVICE_UPDATE"))})),truncated:people.length>6};
     }else if(request.tool==="technical.catalog"){
       const actor=await assistantActor(tx,row.ownerId);if(!actor.admin&&!actor.permissions.has("SERVICE_VIEW"))result={matches:[],truncated:false,accessDenied:true};else{const matches=await tx.technicalDetailCatalog.findMany({where:{isActive:true,OR:[{id:request.query},{code:{equals:request.query,mode:"insensitive"}},{name:{contains:request.query,mode:"insensitive"}}]},select:{id:true,name:true,code:true,area:true,updatedAt:true},take:7,orderBy:{id:"asc"}});result={matches:matches.slice(0,6),truncated:matches.length>6};}
     }else{
       const actor=await assistantActor(tx,row.ownerId);if(request.tool==="accessories.search"&&!actor.admin&&!actor.permissions.has("ACCESSORY_VIEW"))result={matches:[],truncated:false,accessDenied:true};else {result=await executeIntakeLookup(tx,request);if(request.tool==="work.open")result={...result,openWatchWork:(result.openWatchWork as {id:string}[]).map(item=>({id:item.id}))};}
     }
     const entry={request,result};await tx.customerAssistantConversation.update({where:{id},data:{evidence:json([...entries,entry])}});return {evidence:entry};
   }
   if(operation!=="finish")throw new AssistantError("Lệnh không hợp lệ.");
   const failed=body.failed===true;let reply=typeof body.reply==="string"?body.reply.trim().slice(0,1500):"";if(!reply&&!failed)throw new AssistantError("Thiếu câu trả lời.");
   let plan:AssistantPlan|undefined,request:CustomerRequest|undefined;
   if(!failed&&!row.approvedAt&&body.plan){plan=assistantPlanSchema.parse(body.plan);const pinned=state(row).pinnedProductId;
     if((pinned&&plan.productId!==pinned)||!planHasEvidence(plan,evidence(row))){plan=undefined;reply="Mình chưa xác minh đủ khách, watch, danh mục hoặc người nhận. Bạn cho mình mã cụ thể để tránh chọn nhầm nhé.";}
     else request=await requestFromPlan(tx,row,plan);
   }
   if(plan)reply="Mình đề xuất giao các việc bên dưới. Bạn duyệt trước khi thực hiện nhé.";
   if(row.approvedAt&&body.plan)reply="Các việc đã giao không tự sửa qua chat. Bạn mở phiếu/task liên quan để thực hiện thay đổi theo luồng hiện có nhé.";
   const s=state(row);const next=message(s,failed?"Codex chưa hoàn tất lượt này. Bạn có thể nhắn lại để thử tiếp; chưa giao thêm việc.":reply);
   if(!row.approvedAt){if(request&&plan){next.customerRequest=request;next.pinnedProductId=plan.productId;next.context={kind:"watches",label:request.watch,id:plan.productId,href:`/admin/watches/${plan.productId}`};}else delete next.customerRequest;}
   await tx.customerAssistantConversation.update({where:{id},data:{state:json(next),status:row.approvedAt?"APPLIED":failed?"FAILED":plan?"DRAFT":"NEEDS_INFO",plan:row.approvedAt?undefined:plan?json(plan):Prisma.DbNull,errorCode:failed?"GENERATION_FAILED":null,leaseToken:null,leaseExpiresAt:null}});return {accepted:true};
 });
}
async function requestFromPlan(tx:DB,row:CustomerAssistantConversation,plan:AssistantPlan):Promise<CustomerRequest>{
 const customer=await tx.customer.findUniqueOrThrow({where:{id:plan.customerId},select:{name:true}}),product=await tx.product.findUniqueOrThrow({where:{id:plan.productId},select:{sku:true,title:true}}),actor=await assistantActor(tx,row.ownerId);
 const conditions=[];for(const c of plan.conditions){const person=await assistantRecipient(tx,c.assigneeUserId,c.kind==="TECHNICAL");if(!person)throw new AssistantError("Người nhận không còn hợp lệ.");conditions.push({id:c.key,requirement:c.requirement,expected:c.expected,kind:c.kind,assignee:person.name||`Nhân viên ${person.id.slice(0,8)}`,progress:"Chưa giao",outcome:"Chưa xác minh",result:""});}
 return {id:row.id,reference:"",customer:customer.name,watch:product.sku||product.title,owner:actor.name||"Bạn",original:state(row).messages.filter(m=>m.role==="user").map(m=>m.text).join("\n"),status:"DRAFT",conditions,decision:"Chưa quyết định",reviewReady:true};
}

export async function approveAssistant(userId:string,id:string,revision:number,defer:(work:()=>Promise<void>)=>void){
 const completed=await transaction(async tx=>{
   await lock(tx,id);const row=await owned(tx,id,userId);const actor=await assistantActor(tx,userId);
   if(row.approvedAt){if(row.approvedRevision===revision)return {row,work:[]};throw new AssistantError("Yêu cầu đã được duyệt.",409);}
   if(row.status!=="DRAFT"||row.revision!==revision)throw new AssistantError("Bản đề xuất đã thay đổi. Hãy xem bản mới trước khi duyệt.",409);
   const plan=assistantPlanSchema.parse(row.plan),entries=evidence(row);if(!planHasEvidence(plan,entries))throw new AssistantError("Thiếu dữ liệu xác minh.",409);
   await tx.$queryRaw`SELECT "id" FROM "Product" WHERE "id"=${plan.productId} FOR UPDATE`;
   const detail=entries.find(e=>e.request.tool==="watches.detail"),now=await executeIntakeLookup(tx,{tool:"watches.detail",productId:plan.productId});
   if(!detail||["version","watchVersion","activeReservations"].some(k=>now[k]!==detail.result[k]))throw new AssistantError("Watch đã thay đổi sau khi tra cứu. Nhắn lại để Codex cập nhật phương án.",409);
   const observed=entries.filter(e=>e.request.tool==="customers.search").flatMap(e=>e.result.matches as {id:string;version:string}[]||[]).find(c=>c.id===plan.customerId),customer=await tx.customer.findUnique({where:{id:plan.customerId},select:{updatedAt:true}});
   if(!customer||customer.updatedAt.toISOString()!==observed?.version)throw new AssistantError("Khách đã thay đổi sau khi tra cứu. Cần cập nhật đề xuất.",409);
   if(Number(now.activeReservations)>0||now.stockStage!=="IN_STOCK")throw new AssistantError("Watch không ở trạng thái sẵn trong kho hoặc đang có giữ hàng. Cần đối chiếu trước khi giao thêm việc.",409);
   const open=await executeIntakeLookup(tx,{tool:"work.open",productId:plan.productId,customerId:plan.customerId});if(open.truncated||(open.openWatchWork as unknown[]).length||await tx.technicalIssue.count({where:{serviceRequest:{productId:plan.productId},executionStatus:{notIn:["DONE","CANCELED"]}}}))throw new AssistantError("Watch đã có việc hoặc phiếu kỹ thuật đang mở. Cần đối chiếu trước khi giao thêm.",409);
   const work:(()=>Promise<void>)[]=[];const register=(fn:()=>Promise<void>)=>work.push(fn);const r=await requestFromPlan(tx,row,plan);r.status="TRACKING";r.reference=`YC-${row.id.slice(0,8).toUpperCase()}`;
   const space=plan.conditions.some(c=>c.kind==="TASK")?await resolveOperationSpace(tx,{context:"OPERATION"}):null;
   if(plan.conditions.some(c=>c.kind==="TASK")&&!space)throw new AssistantError("Chưa có không gian Vận hành cho task. Quản trị cần khởi tạo qua luồng hiện có.",409);
   for(const [i,c] of plan.conditions.entries()){
     const person=await assistantRecipient(tx,c.assigneeUserId,c.kind==="TECHNICAL");if(!person)throw new AssistantError("Người nhận đã thay đổi hoặc thiếu quyền.",409);
     const note=`Yêu cầu khách hàng ${r.reference}\n${c.expected}\nKhách: ${plan.customerId}`;
     if(c.kind==="TECHNICAL"){
       if(!actor.admin&&!["SERVICE_VIEW","SERVICE_CREATE"].every(p=>actor.permissions.has(p)))throw new AssistantError("Bạn thiếu quyền tạo yêu cầu kỹ thuật.",403);
       const catalog=await tx.technicalDetailCatalog.findFirst({where:{id:c.technicalDetailId!,isActive:true}});const seen=entries.filter(e=>e.request.tool==="technical.catalog").flatMap(e=>e.result.matches as {id:string;updatedAt:string}[]||[]).find(m=>m.id===c.technicalDetailId);
       if(!catalog||!seen||new Date(seen.updatedAt).getTime()!==catalog.updatedAt.getTime())throw new AssistantError("Danh mục kỹ thuật đã thay đổi.",409);
       const serviceId=await getOrCreateActiveWatchServiceTx(tx,plan.productId,userId,register);
       const issue=await createTechnicalIssue({serviceRequestId:serviceId,technicalDetailCatalogId:catalog.id,area:catalog.area,summary:c.requirement,note,technicianId:person.id,actorUserId:userId,issueType:"CHECK",actionMode:"INTERNAL",deferConsumers:register},tx);
       r.conditions[i].linkedRef=issue.id;r.conditions[i].progress=issue.executionStatus;
       await tx.notification.create({data:{userId:person.id,type:`CUSTOMER_AI_${id}_${c.key}`,title:"Yêu cầu kỹ thuật từ khách hàng",message:c.requirement,metadata:{customerAssistantId:id,technicalIssueId:issue.id,route:`/admin/services/issues-board?serviceRequestId=${serviceId}`}}});
     }else if(space){
       const item=await tx.taskItem.create({data:{taskId:space.task.id,title:c.requirement,note:["workTypeKey: ad-hoc-work","blueprintKey: ad-hoc-work","blueprintSource: REGISTRY","workspaceKind: STANDALONE_WORKSPACE","operationWorkspaceRole: AD_HOC_WORK","ownerType: USER","workspaceType: ad-hoc-work","shareGroupKey: operation","itemLabel: Việc phát sinh","defaultView: items","identityTargetType: WATCH",`requestDetail: ${c.expected.replace(/[\r\n]/g," ")}`,note].join("\n"),userId,assignedToUserId:person.id,workTypeId:"ad-hoc-work"}});
       await ensureTaskItemReferenceBinding(tx,{taskId:space.task.id,taskItemId:item.id,targetType:"WATCH",targetId:plan.productId,actionType:"LINKED",createdByUserId:userId,metadataJson:{source:"CUSTOMER_AI",customerAssistantId:id,customerId:plan.customerId,workTypeKey:"ad-hoc-work",targetTitle:String(now.title||r.watch),targetRef:r.watch,targetHref:`/admin/watches/${plan.productId}`,intakeNote:c.expected}});
       await tx.taskItemActivity.create({data:{taskItemId:item.id,actorUserId:userId,sourceType:"SYSTEM",sourceId:id,title:"Giao việc sau khi duyệt yêu cầu khách hàng",body:c.expected}});
       await recordBusinessEvent(tx,{eventKey:"task.item.created",targetType:"TASK_ITEM",targetId:item.id,actorUserId:userId,payload:{taskId:space.task.id,taskItemId:item.id,taskItemTitle:item.title,assignedToUserId:person.id,workspaceKind:"STANDALONE_WORKSPACE",operationWorkspaceRole:"AD_HOC_WORK",workTypeKey:"ad-hoc-work"}},{deferConsumers:register});
       await tx.notification.create({data:{userId:person.id,taskId:space.task.id,type:`CUSTOMER_AI_${id}_${c.key}`,title:"Công việc từ yêu cầu khách hàng",message:c.requirement,metadata:{customerAssistantId:id,taskItemId:item.id,route:"/admin/coordination/operation?view=ad-hoc-work"}}});r.conditions[i].linkedRef=item.id;r.conditions[i].progress=item.status;
     }
   }
   const next={...state(row),customerRequest:r,approved:true};const updated=await tx.customerAssistantConversation.update({where:{id},data:{approvedAt:new Date(),approvedRevision:revision,status:"APPLIED",state:json(message(next,"Đã giao các phiếu/task theo bản bạn duyệt. Bạn có thể mở công việc liên quan để theo dõi."))}});return {row:updated,work};
 });for(const fn of completed.work)defer(fn);return dto(completed.row);
}
export async function recordConditionOutcome(userId:string,id:string,conditionId:string,outcome:string,result:string){
 await assistantActor(prisma,userId);return transaction(async tx=>{await lock(tx,id);const row=await owned(tx,id,userId);if(!row.approvedAt||["QUEUED","RUNNING"].includes(row.status))throw new AssistantError("Chưa thể cập nhật kết quả lúc này.",409);const s=state(row);if(!s.customerRequest?.conditions.some(c=>c.id===conditionId))throw new AssistantError("Không tìm thấy điều kiện.");s.customerRequest.conditions=s.customerRequest.conditions.map(c=>c.id===conditionId?{...c,outcome,result}:c);await tx.customerAssistantConversation.update({where:{id},data:{state:json(s)}});return {ok:true};});
}
