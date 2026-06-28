import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowActionSelectObjectSchema as WorkflowActionSelectObjectSchema } from './objects/WorkflowActionSelect.schema';
import { WorkflowActionIncludeObjectSchema as WorkflowActionIncludeObjectSchema } from './objects/WorkflowActionInclude.schema';
import { WorkflowActionCreateInputObjectSchema as WorkflowActionCreateInputObjectSchema } from './objects/WorkflowActionCreateInput.schema';
import { WorkflowActionUncheckedCreateInputObjectSchema as WorkflowActionUncheckedCreateInputObjectSchema } from './objects/WorkflowActionUncheckedCreateInput.schema';

export const WorkflowActionCreateOneSchema: z.ZodType<Prisma.WorkflowActionCreateArgs> = z.object({ select: WorkflowActionSelectObjectSchema.optional(), include: WorkflowActionIncludeObjectSchema.optional(), data: z.union([WorkflowActionCreateInputObjectSchema, WorkflowActionUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.WorkflowActionCreateArgs>;

export const WorkflowActionCreateOneZodSchema = z.object({ select: WorkflowActionSelectObjectSchema.optional(), include: WorkflowActionIncludeObjectSchema.optional(), data: z.union([WorkflowActionCreateInputObjectSchema, WorkflowActionUncheckedCreateInputObjectSchema]) }).strict();