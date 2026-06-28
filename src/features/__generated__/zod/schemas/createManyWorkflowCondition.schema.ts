import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowConditionCreateManyInputObjectSchema as WorkflowConditionCreateManyInputObjectSchema } from './objects/WorkflowConditionCreateManyInput.schema';

export const WorkflowConditionCreateManySchema: z.ZodType<Prisma.WorkflowConditionCreateManyArgs> = z.object({ data: z.union([ WorkflowConditionCreateManyInputObjectSchema, z.array(WorkflowConditionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowConditionCreateManyArgs>;

export const WorkflowConditionCreateManyZodSchema = z.object({ data: z.union([ WorkflowConditionCreateManyInputObjectSchema, z.array(WorkflowConditionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();