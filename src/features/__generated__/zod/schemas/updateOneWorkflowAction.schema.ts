import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowActionSelectObjectSchema as WorkflowActionSelectObjectSchema } from './objects/WorkflowActionSelect.schema';
import { WorkflowActionIncludeObjectSchema as WorkflowActionIncludeObjectSchema } from './objects/WorkflowActionInclude.schema';
import { WorkflowActionUpdateInputObjectSchema as WorkflowActionUpdateInputObjectSchema } from './objects/WorkflowActionUpdateInput.schema';
import { WorkflowActionUncheckedUpdateInputObjectSchema as WorkflowActionUncheckedUpdateInputObjectSchema } from './objects/WorkflowActionUncheckedUpdateInput.schema';
import { WorkflowActionWhereUniqueInputObjectSchema as WorkflowActionWhereUniqueInputObjectSchema } from './objects/WorkflowActionWhereUniqueInput.schema';

export const WorkflowActionUpdateOneSchema: z.ZodType<Prisma.WorkflowActionUpdateArgs> = z.object({ select: WorkflowActionSelectObjectSchema.optional(), include: WorkflowActionIncludeObjectSchema.optional(), data: z.union([WorkflowActionUpdateInputObjectSchema, WorkflowActionUncheckedUpdateInputObjectSchema]), where: WorkflowActionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkflowActionUpdateArgs>;

export const WorkflowActionUpdateOneZodSchema = z.object({ select: WorkflowActionSelectObjectSchema.optional(), include: WorkflowActionIncludeObjectSchema.optional(), data: z.union([WorkflowActionUpdateInputObjectSchema, WorkflowActionUncheckedUpdateInputObjectSchema]), where: WorkflowActionWhereUniqueInputObjectSchema }).strict();