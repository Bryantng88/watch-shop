import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowTemplateSelectObjectSchema as WorkflowTemplateSelectObjectSchema } from './objects/WorkflowTemplateSelect.schema';
import { WorkflowTemplateUpdateManyMutationInputObjectSchema as WorkflowTemplateUpdateManyMutationInputObjectSchema } from './objects/WorkflowTemplateUpdateManyMutationInput.schema';
import { WorkflowTemplateWhereInputObjectSchema as WorkflowTemplateWhereInputObjectSchema } from './objects/WorkflowTemplateWhereInput.schema';

export const WorkflowTemplateUpdateManyAndReturnSchema: z.ZodType<Prisma.WorkflowTemplateUpdateManyAndReturnArgs> = z.object({ select: WorkflowTemplateSelectObjectSchema.optional(), data: WorkflowTemplateUpdateManyMutationInputObjectSchema, where: WorkflowTemplateWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowTemplateUpdateManyAndReturnArgs>;

export const WorkflowTemplateUpdateManyAndReturnZodSchema = z.object({ select: WorkflowTemplateSelectObjectSchema.optional(), data: WorkflowTemplateUpdateManyMutationInputObjectSchema, where: WorkflowTemplateWhereInputObjectSchema.optional() }).strict();