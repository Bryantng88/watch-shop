import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowConditionSelectObjectSchema as WorkflowConditionSelectObjectSchema } from './objects/WorkflowConditionSelect.schema';
import { WorkflowConditionUpdateManyMutationInputObjectSchema as WorkflowConditionUpdateManyMutationInputObjectSchema } from './objects/WorkflowConditionUpdateManyMutationInput.schema';
import { WorkflowConditionWhereInputObjectSchema as WorkflowConditionWhereInputObjectSchema } from './objects/WorkflowConditionWhereInput.schema';

export const WorkflowConditionUpdateManyAndReturnSchema: z.ZodType<Prisma.WorkflowConditionUpdateManyAndReturnArgs> = z.object({ select: WorkflowConditionSelectObjectSchema.optional(), data: WorkflowConditionUpdateManyMutationInputObjectSchema, where: WorkflowConditionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowConditionUpdateManyAndReturnArgs>;

export const WorkflowConditionUpdateManyAndReturnZodSchema = z.object({ select: WorkflowConditionSelectObjectSchema.optional(), data: WorkflowConditionUpdateManyMutationInputObjectSchema, where: WorkflowConditionWhereInputObjectSchema.optional() }).strict();