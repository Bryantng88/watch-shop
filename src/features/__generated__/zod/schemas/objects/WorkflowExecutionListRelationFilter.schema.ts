import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionWhereInputObjectSchema as WorkflowExecutionWhereInputObjectSchema } from './WorkflowExecutionWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => WorkflowExecutionWhereInputObjectSchema).optional(),
  some: z.lazy(() => WorkflowExecutionWhereInputObjectSchema).optional(),
  none: z.lazy(() => WorkflowExecutionWhereInputObjectSchema).optional()
}).strict();
export const WorkflowExecutionListRelationFilterObjectSchema: z.ZodType<Prisma.WorkflowExecutionListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionListRelationFilter>;
export const WorkflowExecutionListRelationFilterObjectZodSchema = makeSchema();
