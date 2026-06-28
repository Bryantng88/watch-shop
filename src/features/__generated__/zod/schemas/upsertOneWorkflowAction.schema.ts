import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowActionSelectObjectSchema as WorkflowActionSelectObjectSchema } from './objects/WorkflowActionSelect.schema';
import { WorkflowActionIncludeObjectSchema as WorkflowActionIncludeObjectSchema } from './objects/WorkflowActionInclude.schema';
import { WorkflowActionWhereUniqueInputObjectSchema as WorkflowActionWhereUniqueInputObjectSchema } from './objects/WorkflowActionWhereUniqueInput.schema';
import { WorkflowActionCreateInputObjectSchema as WorkflowActionCreateInputObjectSchema } from './objects/WorkflowActionCreateInput.schema';
import { WorkflowActionUncheckedCreateInputObjectSchema as WorkflowActionUncheckedCreateInputObjectSchema } from './objects/WorkflowActionUncheckedCreateInput.schema';
import { WorkflowActionUpdateInputObjectSchema as WorkflowActionUpdateInputObjectSchema } from './objects/WorkflowActionUpdateInput.schema';
import { WorkflowActionUncheckedUpdateInputObjectSchema as WorkflowActionUncheckedUpdateInputObjectSchema } from './objects/WorkflowActionUncheckedUpdateInput.schema';

export const WorkflowActionUpsertOneSchema: z.ZodType<Prisma.WorkflowActionUpsertArgs> = z.object({ select: WorkflowActionSelectObjectSchema.optional(), include: WorkflowActionIncludeObjectSchema.optional(), where: WorkflowActionWhereUniqueInputObjectSchema, create: z.union([ WorkflowActionCreateInputObjectSchema, WorkflowActionUncheckedCreateInputObjectSchema ]), update: z.union([ WorkflowActionUpdateInputObjectSchema, WorkflowActionUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.WorkflowActionUpsertArgs>;

export const WorkflowActionUpsertOneZodSchema = z.object({ select: WorkflowActionSelectObjectSchema.optional(), include: WorkflowActionIncludeObjectSchema.optional(), where: WorkflowActionWhereUniqueInputObjectSchema, create: z.union([ WorkflowActionCreateInputObjectSchema, WorkflowActionUncheckedCreateInputObjectSchema ]), update: z.union([ WorkflowActionUpdateInputObjectSchema, WorkflowActionUncheckedUpdateInputObjectSchema ]) }).strict();