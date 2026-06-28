import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowExecutionSelectObjectSchema as WorkflowExecutionSelectObjectSchema } from './objects/WorkflowExecutionSelect.schema';
import { WorkflowExecutionCreateManyInputObjectSchema as WorkflowExecutionCreateManyInputObjectSchema } from './objects/WorkflowExecutionCreateManyInput.schema';

export const WorkflowExecutionCreateManyAndReturnSchema: z.ZodType<Prisma.WorkflowExecutionCreateManyAndReturnArgs> = z.object({ select: WorkflowExecutionSelectObjectSchema.optional(), data: z.union([ WorkflowExecutionCreateManyInputObjectSchema, z.array(WorkflowExecutionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowExecutionCreateManyAndReturnArgs>;

export const WorkflowExecutionCreateManyAndReturnZodSchema = z.object({ select: WorkflowExecutionSelectObjectSchema.optional(), data: z.union([ WorkflowExecutionCreateManyInputObjectSchema, z.array(WorkflowExecutionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();