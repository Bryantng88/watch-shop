import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowTemplateSelectObjectSchema as WorkflowTemplateSelectObjectSchema } from './objects/WorkflowTemplateSelect.schema';
import { WorkflowTemplateIncludeObjectSchema as WorkflowTemplateIncludeObjectSchema } from './objects/WorkflowTemplateInclude.schema';
import { WorkflowTemplateWhereUniqueInputObjectSchema as WorkflowTemplateWhereUniqueInputObjectSchema } from './objects/WorkflowTemplateWhereUniqueInput.schema';

export const WorkflowTemplateDeleteOneSchema: z.ZodType<Prisma.WorkflowTemplateDeleteArgs> = z.object({ select: WorkflowTemplateSelectObjectSchema.optional(), include: WorkflowTemplateIncludeObjectSchema.optional(), where: WorkflowTemplateWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkflowTemplateDeleteArgs>;

export const WorkflowTemplateDeleteOneZodSchema = z.object({ select: WorkflowTemplateSelectObjectSchema.optional(), include: WorkflowTemplateIncludeObjectSchema.optional(), where: WorkflowTemplateWhereUniqueInputObjectSchema }).strict();