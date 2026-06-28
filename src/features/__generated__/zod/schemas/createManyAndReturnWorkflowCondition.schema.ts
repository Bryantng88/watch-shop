import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowConditionSelectObjectSchema as WorkflowConditionSelectObjectSchema } from './objects/WorkflowConditionSelect.schema';
import { WorkflowConditionCreateManyInputObjectSchema as WorkflowConditionCreateManyInputObjectSchema } from './objects/WorkflowConditionCreateManyInput.schema';

export const WorkflowConditionCreateManyAndReturnSchema: z.ZodType<Prisma.WorkflowConditionCreateManyAndReturnArgs> = z.object({ select: WorkflowConditionSelectObjectSchema.optional(), data: z.union([ WorkflowConditionCreateManyInputObjectSchema, z.array(WorkflowConditionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowConditionCreateManyAndReturnArgs>;

export const WorkflowConditionCreateManyAndReturnZodSchema = z.object({ select: WorkflowConditionSelectObjectSchema.optional(), data: z.union([ WorkflowConditionCreateManyInputObjectSchema, z.array(WorkflowConditionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();