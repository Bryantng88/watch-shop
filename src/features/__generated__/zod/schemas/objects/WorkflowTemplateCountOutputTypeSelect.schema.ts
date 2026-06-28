import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  conditions: z.boolean().optional(),
  actions: z.boolean().optional(),
  executions: z.boolean().optional(),
  tags: z.boolean().optional()
}).strict();
export const WorkflowTemplateCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.WorkflowTemplateCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateCountOutputTypeSelect>;
export const WorkflowTemplateCountOutputTypeSelectObjectZodSchema = makeSchema();
