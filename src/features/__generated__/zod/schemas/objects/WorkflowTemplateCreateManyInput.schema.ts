import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateStatusSchema } from '../enums/WorkflowTemplateStatus.schema';
import { WorkflowConditionStrategySchema } from '../enums/WorkflowConditionStrategy.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  status: WorkflowTemplateStatusSchema.optional(),
  strategy: WorkflowConditionStrategySchema.optional(),
  ownerType: z.string().optional().nullable(),
  ownerId: z.string().optional().nullable(),
  isSystem: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const WorkflowTemplateCreateManyInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateCreateManyInput>;
export const WorkflowTemplateCreateManyInputObjectZodSchema = makeSchema();
