import { z } from "zod";
import { businessDateSchema } from "./business-day";
import { navigationIntentSchema } from "./navigation";
const id=z.string().trim().min(1).max(100);
const text=z.string().trim().min(1).max(1500).refine(s=>!/(?:blueprint\w*|workTypeKey|workspaceKind|sharedUserIds|operationWorkspaceRole|systemShareGroupKey)\s*:/i.test(s),"Không được chèn cấu hình workflow.");
export const assistantPlanSchema=z.object({customerId:id.nullable(),productId:id,conditions:z.array(z.object({key:z.string().regex(/^[a-z][a-z0-9-]{0,29}$/),requirement:text,expected:text,kind:z.enum(["TECHNICAL","TASK"]),assigneeUserId:id,technicalDetailId:id.nullable()}).strict()).min(1).max(8)}).strict().superRefine((p,ctx)=>{
 if(new Set(p.conditions.map(c=>c.key)).size!==p.conditions.length)ctx.addIssue({code:"custom",message:"Mã điều kiện bị trùng"});
 if(new Set(p.conditions.map(c=>c.kind==="TECHNICAL"?`TECHNICAL:${c.technicalDetailId}`:`TASK:${c.requirement.toLocaleLowerCase()}`)).size!==p.conditions.length)ctx.addIssue({code:"custom",message:"Nghiệp vụ trong cùng yêu cầu bị trùng"});
 if(p.conditions.some(c=>(c.kind==="TECHNICAL")!==!!c.technicalDetailId))ctx.addIssue({code:"custom",message:"Phiếu kỹ thuật cần danh mục kỹ thuật đã xác minh"});
});
export type AssistantPlan=z.infer<typeof assistantPlanSchema>;
export const assistantLookupSchema=z.discriminatedUnion("tool",[
 z.object({tool:z.literal("stock.receipts"),query:z.string().min(2).max(1500)}).strict(),
 z.object({tool:z.literal("media.watches.select"),query:z.string().min(2).max(1500)}).strict(),
 z.object({tool:z.literal("media.posts.draft"),query:z.string().min(2).max(10000)}).strict(),
 z.object({tool:z.literal("media.inspect"),query:z.string().uuid()}).strict(),
 z.object({tool:z.literal("media.draft"),query:z.string().uuid()}).strict(),
 z.object({tool:z.literal("personalWork.search"),query:z.string().trim().min(2).max(100)}).strict(),
 z.object({tool:z.literal("personalWork.detail"),query:id}).strict(),
 z.object({tool:z.literal("personalWork.today")}).strict(),
 z.object({tool:z.literal("personalWork.overdue")}).strict(),
 z.object({tool:z.literal("personalWork.categories")}).strict(),
 z.object({tool:z.literal("personalWork.people"),query:z.string().trim().min(2).max(100)}).strict(),
 z.object({tool:z.literal("orders.list"),query:businessDateSchema.nullable().default(null)}).strict(),
 z.object({tool:z.literal("customerRepairs.search"),query:z.string().trim().min(2).max(100)}).strict(),
 z.object({tool:z.literal("technicalIssues.list"),query:businessDateSchema.nullable().default(null)}).strict(),
 z.object({tool:z.literal("repository.info")}).strict(),
 z.object({tool:z.literal("repository.history")}).strict(),
 z.object({tool:z.literal("repository.pullRequests")}).strict(),
 z.object({tool:z.literal("repository.tree"),query:z.string().max(220)}).strict(),
 z.object({tool:z.literal("repository.file"),query:z.string().min(1).max(250)}).strict(),
 z.object({tool:z.literal("navigation.open"),query:z.string().trim().min(2).max(100),intent:navigationIntentSchema}).strict(),
 z.object({tool:z.literal("customers.search"),query:z.string().trim().min(2).max(100)}).strict(),
 z.object({tool:z.literal("watches.search"),query:z.string().trim().min(2).max(100)}).strict(),
 z.object({tool:z.literal("accessories.search"),query:z.string().trim().min(2).max(100)}).strict(),
 z.object({tool:z.literal("people.search"),query:z.string().trim().min(2).max(100)}).strict(),
 z.object({tool:z.literal("technical.catalog"),query:z.string().trim().min(2).max(100)}).strict(),
 z.object({tool:z.literal("watches.detail"),productId:id}).strict(),
 z.object({tool:z.literal("watches.images"),productId:id}).strict(),
 z.object({tool:z.literal("work.open"),productId:id,customerId:id.nullable()}).strict(),
]);
export type AssistantLookup=z.infer<typeof assistantLookupSchema>;
export type Evidence={request:AssistantLookup;result:Record<string,unknown>};
export function hasUniqueEvidence(evidence:Evidence[],tool:string,selected:string){
 const searches=evidence.filter(e=>e.request.tool===tool && Array.isArray(e.result.matches) && (e.result.matches as {id:string}[]).some(m=>m.id===selected));
 return searches.length>0 && searches.every(e=>(e.result.matches as unknown[]).length===1 && !e.result.truncated);
}
export function planHasEvidence(plan:AssistantPlan,evidence:Evidence[]){
 return (plan.customerId===null || hasUniqueEvidence(evidence,"customers.search",plan.customerId)) && hasUniqueEvidence(evidence,"watches.search",plan.productId) && evidence.some(e=>e.request.tool==="watches.detail"&&e.request.productId===plan.productId) && evidence.some(e=>e.request.tool==="work.open"&&e.request.productId===plan.productId&&e.request.customerId===plan.customerId) && plan.conditions.every(c=>hasUniqueEvidence(evidence,"people.search",c.assigneeUserId) && (!c.technicalDetailId||hasUniqueEvidence(evidence,"technical.catalog",c.technicalDetailId)));
}
