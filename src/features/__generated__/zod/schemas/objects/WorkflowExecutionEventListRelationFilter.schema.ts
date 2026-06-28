import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionEventWhereInputObjectSchema as WorkflowExecutionEventWhereInputObjectSchema } from './WorkflowExecutionEventWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => WorkflowExecutionEventWhereInputObjectSchema).optional(),
  some: z.lazy(() => WorkflowExecutionEventWhereInputObjectSchema).optional(),
  none: z.lazy(() => WorkflowExecutionEventWhereInputObjectSchema).optional()
}).strict();
export const WorkflowExecutionEventListRelationFilterObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventListRelationFilter>;
export const WorkflowExecutionEventListRelationFilterObjectZodSchema = makeSchema();
