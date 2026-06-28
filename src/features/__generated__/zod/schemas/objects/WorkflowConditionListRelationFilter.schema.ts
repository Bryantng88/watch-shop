import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowConditionWhereInputObjectSchema as WorkflowConditionWhereInputObjectSchema } from './WorkflowConditionWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => WorkflowConditionWhereInputObjectSchema).optional(),
  some: z.lazy(() => WorkflowConditionWhereInputObjectSchema).optional(),
  none: z.lazy(() => WorkflowConditionWhereInputObjectSchema).optional()
}).strict();
export const WorkflowConditionListRelationFilterObjectSchema: z.ZodType<Prisma.WorkflowConditionListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionListRelationFilter>;
export const WorkflowConditionListRelationFilterObjectZodSchema = makeSchema();
