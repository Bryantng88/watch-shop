import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowTemplateSelectObjectSchema as WorkflowTemplateSelectObjectSchema } from './objects/WorkflowTemplateSelect.schema';
import { WorkflowTemplateIncludeObjectSchema as WorkflowTemplateIncludeObjectSchema } from './objects/WorkflowTemplateInclude.schema';
import { WorkflowTemplateWhereUniqueInputObjectSchema as WorkflowTemplateWhereUniqueInputObjectSchema } from './objects/WorkflowTemplateWhereUniqueInput.schema';

export const WorkflowTemplateFindUniqueSchema: z.ZodType<Prisma.WorkflowTemplateFindUniqueArgs> = z.object({ select: WorkflowTemplateSelectObjectSchema.optional(), include: WorkflowTemplateIncludeObjectSchema.optional(), where: WorkflowTemplateWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WorkflowTemplateFindUniqueArgs>;

export const WorkflowTemplateFindUniqueZodSchema = z.object({ select: WorkflowTemplateSelectObjectSchema.optional(), include: WorkflowTemplateIncludeObjectSchema.optional(), where: WorkflowTemplateWhereUniqueInputObjectSchema }).strict();