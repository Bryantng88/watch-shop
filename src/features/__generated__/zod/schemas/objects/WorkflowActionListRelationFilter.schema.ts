import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowActionWhereInputObjectSchema as WorkflowActionWhereInputObjectSchema } from './WorkflowActionWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => WorkflowActionWhereInputObjectSchema).optional(),
  some: z.lazy(() => WorkflowActionWhereInputObjectSchema).optional(),
  none: z.lazy(() => WorkflowActionWhereInputObjectSchema).optional()
}).strict();
export const WorkflowActionListRelationFilterObjectSchema: z.ZodType<Prisma.WorkflowActionListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionListRelationFilter>;
export const WorkflowActionListRelationFilterObjectZodSchema = makeSchema();
