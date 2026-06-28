import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowExecutionEventSelectObjectSchema as WorkflowExecutionEventSelectObjectSchema } from './objects/WorkflowExecutionEventSelect.schema';
import { WorkflowExecutionEventCreateManyInputObjectSchema as WorkflowExecutionEventCreateManyInputObjectSchema } from './objects/WorkflowExecutionEventCreateManyInput.schema';

export const WorkflowExecutionEventCreateManyAndReturnSchema: z.ZodType<Prisma.WorkflowExecutionEventCreateManyAndReturnArgs> = z.object({ select: WorkflowExecutionEventSelectObjectSchema.optional(), data: z.union([ WorkflowExecutionEventCreateManyInputObjectSchema, z.array(WorkflowExecutionEventCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowExecutionEventCreateManyAndReturnArgs>;

export const WorkflowExecutionEventCreateManyAndReturnZodSchema = z.object({ select: WorkflowExecutionEventSelectObjectSchema.optional(), data: z.union([ WorkflowExecutionEventCreateManyInputObjectSchema, z.array(WorkflowExecutionEventCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();