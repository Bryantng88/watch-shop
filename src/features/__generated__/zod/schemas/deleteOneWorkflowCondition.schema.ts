import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowConditionSelectObjectSchema as WorkflowConditionSelectObjectSchema } from './objects/WorkflowConditionSelect.schema';
import { WorkflowConditionIncludeObjectSchema as WorkflowConditionIncludeObjectSchema } from './objects/WorkflowConditionInclude.schema';
import { WorkflowConditionWhereUniqueInputObjectSchema as WorkflowConditionWhereUniqueInputObjectSchema } from './objects/WorkflowConditionWhereUniqueInput.schema';

export const WorkflowConditionDeleteOneSchema: z.ZodType<Prisma.WorkflowConditionDeleteArgs> = z.object({ select: WorkflowConditionSelectObjectSchema.optional(), include: WorkflowConditionIncludeObjectSchema.optional(), where: WorkflowConditionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkflowConditionDeleteArgs>;

export const WorkflowConditionDeleteOneZodSchema = z.object({ select: WorkflowConditionSelectObjectSchema.optional(), include: WorkflowConditionIncludeObjectSchema.optional(), where: WorkflowConditionWhereUniqueInputObjectSchema }).strict();