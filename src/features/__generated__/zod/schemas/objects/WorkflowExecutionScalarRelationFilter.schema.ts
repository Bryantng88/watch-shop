import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionWhereInputObjectSchema as WorkflowExecutionWhereInputObjectSchema } from './WorkflowExecutionWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => WorkflowExecutionWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => WorkflowExecutionWhereInputObjectSchema).optional()
}).strict();
export const WorkflowExecutionScalarRelationFilterObjectSchema: z.ZodType<Prisma.WorkflowExecutionScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionScalarRelationFilter>;
export const WorkflowExecutionScalarRelationFilterObjectZodSchema = makeSchema();
