import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowExecutionCreateManyInputObjectSchema as WorkflowExecutionCreateManyInputObjectSchema } from './objects/WorkflowExecutionCreateManyInput.schema';

export const WorkflowExecutionCreateManySchema: z.ZodType<Prisma.WorkflowExecutionCreateManyArgs> = z.object({ data: z.union([ WorkflowExecutionCreateManyInputObjectSchema, z.array(WorkflowExecutionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowExecutionCreateManyArgs>;

export const WorkflowExecutionCreateManyZodSchema = z.object({ data: z.union([ WorkflowExecutionCreateManyInputObjectSchema, z.array(WorkflowExecutionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();