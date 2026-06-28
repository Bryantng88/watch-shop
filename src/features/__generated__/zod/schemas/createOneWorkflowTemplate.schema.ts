import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowTemplateSelectObjectSchema as WorkflowTemplateSelectObjectSchema } from './objects/WorkflowTemplateSelect.schema';
import { WorkflowTemplateIncludeObjectSchema as WorkflowTemplateIncludeObjectSchema } from './objects/WorkflowTemplateInclude.schema';
import { WorkflowTemplateCreateInputObjectSchema as WorkflowTemplateCreateInputObjectSchema } from './objects/WorkflowTemplateCreateInput.schema';
import { WorkflowTemplateUncheckedCreateInputObjectSchema as WorkflowTemplateUncheckedCreateInputObjectSchema } from './objects/WorkflowTemplateUncheckedCreateInput.schema';

export const WorkflowTemplateCreateOneSchema: z.ZodType<Prisma.WorkflowTemplateCreateArgs> = z.object({ select: WorkflowTemplateSelectObjectSchema.optional(), include: WorkflowTemplateIncludeObjectSchema.optional(), data: z.union([WorkflowTemplateCreateInputObjectSchema, WorkflowTemplateUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.WorkflowTemplateCreateArgs>;

export const WorkflowTemplateCreateOneZodSchema = z.object({ select: WorkflowTemplateSelectObjectSchema.optional(), include: WorkflowTemplateIncludeObjectSchema.optional(), data: z.union([WorkflowTemplateCreateInputObjectSchema, WorkflowTemplateUncheckedCreateInputObjectSchema]) }).strict();