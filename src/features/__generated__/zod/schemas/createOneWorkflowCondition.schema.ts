import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowConditionSelectObjectSchema as WorkflowConditionSelectObjectSchema } from './objects/WorkflowConditionSelect.schema';
import { WorkflowConditionIncludeObjectSchema as WorkflowConditionIncludeObjectSchema } from './objects/WorkflowConditionInclude.schema';
import { WorkflowConditionCreateInputObjectSchema as WorkflowConditionCreateInputObjectSchema } from './objects/WorkflowConditionCreateInput.schema';
import { WorkflowConditionUncheckedCreateInputObjectSchema as WorkflowConditionUncheckedCreateInputObjectSchema } from './objects/WorkflowConditionUncheckedCreateInput.schema';

export const WorkflowConditionCreateOneSchema: z.ZodType<Prisma.WorkflowConditionCreateArgs> = z.object({ select: WorkflowConditionSelectObjectSchema.optional(), include: WorkflowConditionIncludeObjectSchema.optional(), data: z.union([WorkflowConditionCreateInputObjectSchema, WorkflowConditionUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.WorkflowConditionCreateArgs>;

export const WorkflowConditionCreateOneZodSchema = z.object({ select: WorkflowConditionSelectObjectSchema.optional(), include: WorkflowConditionIncludeObjectSchema.optional(), data: z.union([WorkflowConditionCreateInputObjectSchema, WorkflowConditionUncheckedCreateInputObjectSchema]) }).strict();