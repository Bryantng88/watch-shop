import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '@/server/db/client';
import { codexExecutionReadiness } from '@/domains/personal-work/server/codex/codex-config';
import { workflowPlanSchema, requestWorkflowSchema, approveWorkflowSchema } from './workflow-plan';
export function orderCodexReady(){return process.env.ORDER_CODEX_ENABLED==='1'&&codexExecutionReadiness().ready;}
export class WorkflowError extends Error {constructor(message:string,public status=400){super(message);}}
const publicSelect={id:true,orderId:true,requestedByUserId:true,requestText:true,status:true,planJson:true,createdTaskIds:true,errorCode:true,revision:true,createdAt:true} as const;
async function actor(userId:string){
 if(!orderCodexReady())throw new WorkflowError('Chức năng thử nghiệm chỉ bật trên staging.',503);
 const user=await prisma.user.findFirst({where:{id:userId,isActive:true,roles:{some:{name:'ADMIN'}}},select:{id:true}});
 if(!user)throw new WorkflowError('Cần tài khoản ADMIN đang hoạt động.',403);
 return user;
}
async function orderContext(orderId:string){
 const o=await prisma.order.findUnique({where:{id:orderId},select:{id:true,refNo:true,status:true,paymentStatus:true,updatedAt:true,orderItem:{take:20,select:{title:true,quantity:true}}}});
 if(!o)throw new WorkflowError('Không tìm thấy đơn hàng.',404);
 if(['CANCELLED','COMPLETED'].includes(o.status))throw new WorkflowError('Không tạo luồng mới cho đơn đã đóng.');
 return o;
}
export async function listOrderWorkflows(orderId:string,userId:string){
 await actor(userId);await orderContext(orderId);
 // Expired leases are terminal, never silently execute a second attempt.
 await prisma.orderCodexProposal.updateMany({where:{orderId,status:'RUNNING',leaseExpiresAt:{lt:new Date()}},data:{status:'FAILED',errorCode:'LEASE_EXPIRED',leaseToken:null}});
 const [proposals,people]=await Promise.all([prisma.orderCodexProposal.findMany({where:{orderId,requestedByUserId:userId},select:publicSelect,orderBy:{createdAt:'desc'},take:10}),prisma.user.findMany({where:{isActive:true},select:{id:true,name:true},orderBy:{name:'asc'},take:200})]);
 return {proposals,people};
}
export async function requestOrderWorkflow(orderId:string,userId:string,input:unknown){
 await actor(userId);const data=requestWorkflowSchema.parse(input);const o=await orderContext(orderId);
 const previous=await prisma.orderCodexProposal.findUnique({where:{requestKey:data.requestKey}});
 if(previous){if(previous.orderId!==orderId||previous.requestedByUserId!==userId||previous.requestText!==data.text)throw new WorkflowError('Mã yêu cầu đã được sử dụng.',409);return {id:previous.id};}
 const active=await prisma.orderCodexProposal.count({where:{requestedByUserId:userId,status:{in:['QUEUED','RUNNING']}}});if(active>=3)throw new WorkflowError('Bạn đang có 3 yêu cầu chờ. Hãy chờ kết quả.',429);
 const {updatedAt,...context}=o;
 const row=await prisma.orderCodexProposal.create({data:{orderId,requestedByUserId:userId,requestKey:data.requestKey,requestText:data.text,orderVersion:updatedAt,contextJson:{...context,referenceTime:new Date().toISOString(),timeZone:'Asia/Ho_Chi_Minh'} as Prisma.InputJsonValue},select:{id:true}});
 return row;
}
export async function approveOrderWorkflow(orderId:string,userId:string,input:unknown){
 await actor(userId);const data=approveWorkflowSchema.parse(input);
 if(data.plan.questions.length)throw new WorkflowError('Cần giải quyết các câu hỏi trước khi tạo việc (sửa yêu cầu và tạo đề xuất mới).');
 return prisma.$transaction(async tx=>{
  const row=await tx.orderCodexProposal.findUnique({where:{id:data.proposalId}});
  if(!row||row.orderId!==orderId||row.requestedByUserId!==userId)throw new WorkflowError('Không có quyền duyệt đề xuất này.',403);
  if(row.status==='APPLIED')return {taskIds:row.createdTaskIds};
  if(row.status!=='DRAFT'||row.revision!==data.revision)throw new WorkflowError('Đề xuất không còn ở trạng thái có thể duyệt.',409);
  const order=await tx.order.findUnique({where:{id:orderId},select:{updatedAt:true,status:true}});
  if(!order||order.updatedAt.getTime()!==row.orderVersion.getTime()||['CANCELLED','COMPLETED'].includes(order.status))throw new WorkflowError('Đơn hàng đã thay đổi. Hãy yêu cầu đề xuất mới.',409);
  const ids=[...new Set(data.plan.steps.flatMap(s=>s.assignedToUserId?[s.assignedToUserId]:[]))];
  if(await tx.user.count({where:{id:{in:ids},isActive:true}})!==ids.length)throw new WorkflowError('Người phụ trách không còn hoạt động.');
  const locked=await tx.orderCodexProposal.updateMany({where:{id:row.id,status:'DRAFT',revision:data.revision},data:{status:'APPLYING',revision:{increment:1}}});if(locked.count!==1)throw new WorkflowError('Đề xuất đang được duyệt.',409);
  const created: string[]=[];const kinds={SALES:'BUSINESS',TECHNICAL:'SERVICE',MEDIA:'BUSINESS',PAYMENT:'BUSINESS',OPERATION:'OPERATION'} as const;
  const names={SALES:'Bán hàng',TECHNICAL:'Kỹ thuật',MEDIA:'Media',PAYMENT:'Thanh toán',OPERATION:'Vận hành'};
  for(const step of data.plan.steps){
   let space=await tx.task.findFirst({where:{kind:kinds[step.department],periodType:null,periodKey:null,status:{not:'CANCELLED'},OR:[{title:names[step.department]},{description:'Coordination Space '+step.department}]},select:{id:true},orderBy:{createdAt:'desc'}});
   if(!space)space=await tx.task.create({data:{title:names[step.department],description:'Coordination Space '+step.department,kind:kinds[step.department],source:'SYSTEM'},select:{id:true}});
   const depends=step.dependsOn.map(key=>{const idx=data.plan.steps.findIndex(s=>s.key===key);return `${data.plan.steps[idx].title} (${created[idx]})`;});
   const item=await tx.taskItem.create({data:{taskId:space.id,title:step.title,workTypeId:step.department==='OPERATION'?'ad-hoc-work':null,note:[step.department==='OPERATION'?'workTypeKey: ad-hoc-work\nworkspaceKind: STANDALONE_WORKSPACE':'',step.description,'Đơn hàng: '+orderId,'Đề xuất Codex đã duyệt: '+row.id,depends.length?'Chỉ thực hiện sau: '+depends.join('; '):'', 'Thứ tự phụ thuộc là chỉ dẫn; chưa tự khóa hoặc chuyển bước.'].filter(Boolean).join('\n'),assignedToUserId:step.assignedToUserId,userId,priority:'MEDIUM',dueAt:step.dueAt?new Date(step.dueAt):null},select:{id:true}});
   await tx.taskExecution.create({data:{taskId:space.id,taskItemId:item.id,targetType:'ORDER',targetId:orderId,actionType:'LINKED',createdByUserId:userId,metadataJson:{orderCodexProposalId:row.id,stepKey:step.key,department:step.department,dependsOn:step.dependsOn}}});
   await tx.taskItemActivity.create({data:{taskItemId:item.id,actorUserId:userId,sourceType:'SYSTEM',sourceId:row.id,title:'Tạo từ đề xuất Codex đã được duyệt',body:'Chỉ tạo công việc; không thay đổi thanh toán/giao hàng/trạng thái đơn.'}});created.push(item.id);
  }
  await tx.orderCodexProposal.update({where:{id:row.id},data:{status:'APPLIED',planJson:data.plan as Prisma.InputJsonValue,createdTaskIds:created}});
  return {taskIds:created};
 },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
}
export async function claimOrderWorkflow(workerId:string){
 if(!orderCodexReady())throw new WorkflowError('Unavailable',503);
 if(!/^[\w.-]{1,80}$/.test(workerId))throw new WorkflowError('Invalid worker');
 await prisma.orderCodexProposal.updateMany({where:{status:'RUNNING',leaseExpiresAt:{lt:new Date()}},data:{status:'FAILED',errorCode:'LEASE_EXPIRED',leaseToken:null}});
 for(let i=0;i<5;i++){
  const row=await prisma.orderCodexProposal.findFirst({where:{status:'QUEUED'},orderBy:{createdAt:'asc'}});if(!row)return null;
  const u=await prisma.user.findFirst({where:{id:row.requestedByUserId,isActive:true,roles:{some:{name:'ADMIN'}}},select:{id:true}});
  if(!u){await prisma.orderCodexProposal.updateMany({where:{id:row.id,status:'QUEUED'},data:{status:'FAILED',errorCode:'REQUESTER_INACTIVE'}});continue;}
  const leaseToken=randomUUID();const r=await prisma.orderCodexProposal.updateMany({where:{id:row.id,status:'QUEUED'},data:{status:'RUNNING',leaseToken,leaseExpiresAt:new Date(Date.now()+120000)}});
  if(r.count)return {id:row.id,text:row.requestText,context:row.contextJson,leaseToken};
 }return null;
}
export async function heartbeatOrderWorkflow(id:string,leaseToken:string){
 const row=await prisma.orderCodexProposal.findFirst({where:{id,leaseToken,status:'RUNNING',leaseExpiresAt:{gt:new Date()}}});if(!row)return false;
 const u=await prisma.user.findFirst({where:{id:row.requestedByUserId,isActive:true,roles:{some:{name:'ADMIN'}}},select:{id:true}});if(!u)return false;
 const r=await prisma.orderCodexProposal.updateMany({where:{id,leaseToken,status:'RUNNING',leaseExpiresAt:{gt:new Date()}},data:{leaseExpiresAt:new Date(Date.now()+120000)}});return r.count===1;
}
export async function finishOrderWorkflow(id:string,leaseToken:string,plan:unknown,failed:boolean){
 if(!await heartbeatOrderWorkflow(id,leaseToken))return false;
 const validated=failed?null:workflowPlanSchema.parse(plan);
 const r=await prisma.orderCodexProposal.updateMany({where:{id,leaseToken,status:'RUNNING',leaseExpiresAt:{gt:new Date()}},data:{status:failed?'FAILED':'DRAFT',planJson:validated?validated as Prisma.InputJsonValue:Prisma.JsonNull,errorCode:failed?'GENERATION_FAILED':null,leaseToken:null,leaseExpiresAt:null}});return r.count===1;
}
