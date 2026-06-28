import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowExecutionEventCreateManyInputObjectSchema as WorkflowExecutionEventCreateManyInputObjectSchema } from './objects/WorkflowExecutionEventCreateManyInput.schema';

export const WorkflowExecutionEventCreateManySchema: z.ZodType<Prisma.WorkflowExecutionEventCreateManyArgs> = z.object({ data: z.union([ WorkflowExecutionEventCreateManyInputObjectSchema, z.array(WorkflowExecutionEventCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowExecutionEventCreateManyArgs>;

export const WorkflowExecutionEventCreateManyZodSchema = z.object({ data: z.union([ WorkflowExecutionEventCreateManyInputObjectSchema, z.array(WorkflowExecutionEventCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();