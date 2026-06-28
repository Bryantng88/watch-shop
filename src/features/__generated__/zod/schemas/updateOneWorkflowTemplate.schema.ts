import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowTemplateSelectObjectSchema as WorkflowTemplateSelectObjectSchema } from './objects/WorkflowTemplateSelect.schema';
import { WorkflowTemplateIncludeObjectSchema as WorkflowTemplateIncludeObjectSchema } from './objects/WorkflowTemplateInclude.schema';
import { WorkflowTemplateUpdateInputObjectSchema as WorkflowTemplateUpdateInputObjectSchema } from './objects/WorkflowTemplateUpdateInput.schema';
import { WorkflowTemplateUncheckedUpdateInputObjectSchema as WorkflowTemplateUncheckedUpdateInputObjectSchema } from './objects/WorkflowTemplateUncheckedUpdateInput.schema';
import { WorkflowTemplateWhereUniqueInputObjectSchema as WorkflowTemplateWhereUniqueInputObjectSchema } from './objects/WorkflowTemplateWhereUniqueInput.schema';

export const WorkflowTemplateUpdateOneSchema: z.ZodType<Prisma.WorkflowTemplateUpdateArgs> = z.object({ select: WorkflowTemplateSelectObjectSchema.optional(), include: WorkflowTemplateIncludeObjectSchema.optional(), data: z.union([WorkflowTemplateUpdateInputObjectSchema, WorkflowTemplateUncheckedUpdateInputObjectSchema]), where: WorkflowTemplateWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkflowTemplateUpdateArgs>;

export const WorkflowTemplateUpdateOneZodSchema = z.object({ select: WorkflowTemplateSelectObjectSchema.optional(), include: WorkflowTemplateIncludeObjectSchema.optional(), data: z.union([WorkflowTemplateUpdateInputObjectSchema, WorkflowTemplateUncheckedUpdateInputObjectSchema]), where: WorkflowTemplateWhereUniqueInputObjectSchema }).strict();