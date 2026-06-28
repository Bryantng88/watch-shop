import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowConditionSelectObjectSchema as WorkflowConditionSelectObjectSchema } from './objects/WorkflowConditionSelect.schema';
import { WorkflowConditionIncludeObjectSchema as WorkflowConditionIncludeObjectSchema } from './objects/WorkflowConditionInclude.schema';
import { WorkflowConditionWhereUniqueInputObjectSchema as WorkflowConditionWhereUniqueInputObjectSchema } from './objects/WorkflowConditionWhereUniqueInput.schema';
import { WorkflowConditionCreateInputObjectSchema as WorkflowConditionCreateInputObjectSchema } from './objects/WorkflowConditionCreateInput.schema';
import { WorkflowConditionUncheckedCreateInputObjectSchema as WorkflowConditionUncheckedCreateInputObjectSchema } from './objects/WorkflowConditionUncheckedCreateInput.schema';
import { WorkflowConditionUpdateInputObjectSchema as WorkflowConditionUpdateInputObjectSchema } from './objects/WorkflowConditionUpdateInput.schema';
import { WorkflowConditionUncheckedUpdateInputObjectSchema as WorkflowConditionUncheckedUpdateInputObjectSchema } from './objects/WorkflowConditionUncheckedUpdateInput.schema';

export const WorkflowConditionUpsertOneSchema: z.ZodType<Prisma.WorkflowConditionUpsertArgs> = z.object({ select: WorkflowConditionSelectObjectSchema.optional(), include: WorkflowConditionIncludeObjectSchema.optional(), where: WorkflowConditionWhereUniqueInputObjectSchema, create: z.union([ WorkflowConditionCreateInputObjectSchema, WorkflowConditionUncheckedCreateInputObjectSchema ]), update: z.union([ WorkflowConditionUpdateInputObjectSchema, WorkflowConditionUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.WorkflowConditionUpsertArgs>;

export const WorkflowConditionUpsertOneZodSchema = z.object({ select: WorkflowConditionSelectObjectSchema.optional(), include: WorkflowConditionIncludeObjectSchema.optional(), where: WorkflowConditionWhereUniqueInputObjectSchema, create: z.union([ WorkflowConditionCreateInputObjectSchema, WorkflowConditionUncheckedCreateInputObjectSchema ]), update: z.union([ WorkflowConditionUpdateInputObjectSchema, WorkflowConditionUncheckedUpdateInputObjectSchema ]) }).strict();