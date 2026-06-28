import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowConditionUpdateManyMutationInputObjectSchema as WorkflowConditionUpdateManyMutationInputObjectSchema } from './objects/WorkflowConditionUpdateManyMutationInput.schema';
import { WorkflowConditionWhereInputObjectSchema as WorkflowConditionWhereInputObjectSchema } from './objects/WorkflowConditionWhereInput.schema';

export const WorkflowConditionUpdateManySchema: z.ZodType<Prisma.WorkflowConditionUpdateManyArgs> = z.object({ data: WorkflowConditionUpdateManyMutationInputObjectSchema, where: WorkflowConditionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowConditionUpdateManyArgs>;

export const WorkflowConditionUpdateManyZodSchema = z.object({ data: WorkflowConditionUpdateManyMutationInputObjectSchema, where: WorkflowConditionWhereInputObjectSchema.optional() }).strict();