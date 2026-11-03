import { z } from 'zod';
export const departments = ['SALES','TECHNICAL','MEDIA','PAYMENT','OPERATION'] as const;
export const departmentLabels: Record<string,string> = {SALES:'Sales',TECHNICAL:'Kỹ thuật',MEDIA:'Media',PAYMENT:'Kế toán',OPERATION:'Vận hành / giao nhận'};
export const workflowStepSchema = z.object({key:z.string().regex(/^[a-z][a-z0-9-]{0,29}$/),title:z.string().trim().min(1).max(180),department:z.enum(departments),description:z.string().max(2000),dependsOn:z.array(z.string().max(30)).max(12),dueAt:z.string().datetime({offset:true}).nullable(),assignedToUserId:z.string().max(100).nullable()}).strict();
export const workflowPlanSchema=z.object({summary:z.string().min(1).max(2000),questions:z.array(z.string().max(500)).max(10),steps:z.array(workflowStepSchema).min(1).max(12)}).strict().superRefine((p,ctx)=>{
 const keys=new Map(p.steps.map((s,i)=>[s.key,i]));
 if(keys.size!==p.steps.length)ctx.addIssue({code:'custom',message:'Mã bước bị trùng'});
 for(let i=0;i<p.steps.length;i++)for(const key of p.steps[i].dependsOn){const j=keys.get(key);if(j===undefined||j>=i)ctx.addIssue({code:'custom',message:'Bước phụ thuộc phải nằm trước bước hiện tại'});}
});
export type WorkflowPlan=z.infer<typeof workflowPlanSchema>;
export type WorkflowStep=z.infer<typeof workflowStepSchema>;
export const requestWorkflowSchema=z.object({requestKey:z.string().uuid(),text:z.string().trim().min(5).max(6000)}).strict();
export const approveWorkflowSchema=z.object({proposalId:z.string().uuid(),revision:z.number().int().nonnegative(),plan:workflowPlanSchema}).strict();
