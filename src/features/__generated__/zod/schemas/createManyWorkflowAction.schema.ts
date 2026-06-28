import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowActionCreateManyInputObjectSchema as WorkflowActionCreateManyInputObjectSchema } from './objects/WorkflowActionCreateManyInput.schema';

export const WorkflowActionCreateManySchema: z.ZodType<Prisma.WorkflowActionCreateManyArgs> = z.object({ data: z.union([ WorkflowActionCreateManyInputObjectSchema, z.array(WorkflowActionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowActionCreateManyArgs>;

export const WorkflowActionCreateManyZodSchema = z.object({ data: z.union([ WorkflowActionCreateManyInputObjectSchema, z.array(WorkflowActionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();