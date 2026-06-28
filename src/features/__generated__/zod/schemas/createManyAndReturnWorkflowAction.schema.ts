import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowActionSelectObjectSchema as WorkflowActionSelectObjectSchema } from './objects/WorkflowActionSelect.schema';
import { WorkflowActionCreateManyInputObjectSchema as WorkflowActionCreateManyInputObjectSchema } from './objects/WorkflowActionCreateManyInput.schema';

export const WorkflowActionCreateManyAndReturnSchema: z.ZodType<Prisma.WorkflowActionCreateManyAndReturnArgs> = z.object({ select: WorkflowActionSelectObjectSchema.optional(), data: z.union([ WorkflowActionCreateManyInputObjectSchema, z.array(WorkflowActionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowActionCreateManyAndReturnArgs>;

export const WorkflowActionCreateManyAndReturnZodSchema = z.object({ select: WorkflowActionSelectObjectSchema.optional(), data: z.union([ WorkflowActionCreateManyInputObjectSchema, z.array(WorkflowActionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();