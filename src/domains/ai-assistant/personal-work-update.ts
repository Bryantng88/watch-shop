import {z} from "zod";
export const personalWorkUpdateSchema=z.object({
  itemId:z.string().trim().min(1).max(100),
  expectedUpdatedAt:z.string().datetime({offset:true}),
  fields:z.array(z.enum(["title","note","dueAt","scheduledEndAt","status"])).min(1).max(5).refine(v=>new Set(v).size===v.length,"Trường cập nhật bị trùng"),
  changes:z.object({
    title:z.string().trim().min(1).max(300).nullable(),
    note:z.string().trim().max(4000).nullable(),
    dueAt:z.string().datetime({offset:true}).nullable(),
    scheduledEndAt:z.string().datetime({offset:true}).nullable(),
    status:z.enum(["TODO","IN_PROGRESS","DONE","CANCELLED"]).nullable(),
  }).strict(),
}).strict().superRefine((p,c)=>{for(const field of p.fields){if((field==="title"||field==="status")&&p.changes[field]===null)c.addIssue({code:"custom",message:"Trường cập nhật không được trống"});}for(const [field,value] of Object.entries(p.changes)){if(value!==null&&!p.fields.includes(field as typeof p.fields[number]))c.addIssue({code:"custom",message:"Có giá trị ngoài các trường cần cập nhật"});}});
export type PersonalWorkUpdate=z.infer<typeof personalWorkUpdateSchema>;
export type PersonalWorkUpdateDraft={plan:PersonalWorkUpdate;revision:number;title:string;kind:"TASK"|"EVENT";requiredPermissions:string[];requiredTaskIds:string[]};
export type UpdatedPersonalWork={revision:number;id:string;title:string;kind:"TASK"|"EVENT"};

export function personalWorkUpdateInput(plan:PersonalWorkUpdate){const c=plan.changes;return {...(plan.fields.includes("title")?{title:c.title!}:{}),...(plan.fields.includes("status")?{status:c.status!}:{}),...(plan.fields.includes("note")?{note:c.note}:{}),...(plan.fields.includes("dueAt")?{dueAt:c.dueAt}:{}),...(plan.fields.includes("scheduledEndAt")?{scheduledEndAt:c.scheduledEndAt}:{})};}
