import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowConditionSelectObjectSchema as WorkflowConditionSelectObjectSchema } from './objects/WorkflowConditionSelect.schema';
import { WorkflowConditionIncludeObjectSchema as WorkflowConditionIncludeObjectSchema } from './objects/WorkflowConditionInclude.schema';
import { WorkflowConditionUpdateInputObjectSchema as WorkflowConditionUpdateInputObjectSchema } from './objects/WorkflowConditionUpdateInput.schema';
import { WorkflowConditionUncheckedUpdateInputObjectSchema as WorkflowConditionUncheckedUpdateInputObjectSchema } from './objects/WorkflowConditionUncheckedUpdateInput.schema';
import { WorkflowConditionWhereUniqueInputObjectSchema as WorkflowConditionWhereUniqueInputObjectSchema } from './objects/WorkflowConditionWhereUniqueInput.schema';

export const WorkflowConditionUpdateOneSchema: z.ZodType<Prisma.WorkflowConditionUpdateArgs> = z.object({ select: WorkflowConditionSelectObjectSchema.optional(), include: WorkflowConditionIncludeObjectSchema.optional(), data: z.union([WorkflowConditionUpdateInputObjectSchema, WorkflowConditionUncheckedUpdateInputObjectSchema]), where: WorkflowConditionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkflowConditionUpdateArgs>;

export const WorkflowConditionUpdateOneZodSchema = z.object({ select: WorkflowConditionSelectObjectSchema.optional(), include: WorkflowConditionIncludeObjectSchema.optional(), data: z.union([WorkflowConditionUpdateInputObjectSchema, WorkflowConditionUncheckedUpdateInputObjectSchema]), where: WorkflowConditionWhereUniqueInputObjectSchema }).strict();