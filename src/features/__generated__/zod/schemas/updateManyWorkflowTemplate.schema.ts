import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowTemplateUpdateManyMutationInputObjectSchema as WorkflowTemplateUpdateManyMutationInputObjectSchema } from './objects/WorkflowTemplateUpdateManyMutationInput.schema';
import { WorkflowTemplateWhereInputObjectSchema as WorkflowTemplateWhereInputObjectSchema } from './objects/WorkflowTemplateWhereInput.schema';

export const WorkflowTemplateUpdateManySchema: z.ZodType<Prisma.WorkflowTemplateUpdateManyArgs> = z.object({ data: WorkflowTemplateUpdateManyMutationInputObjectSchema, where: WorkflowTemplateWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowTemplateUpdateManyArgs>;

export const WorkflowTemplateUpdateManyZodSchema = z.object({ data: WorkflowTemplateUpdateManyMutationInputObjectSchema, where: WorkflowTemplateWhereInputObjectSchema.optional() }).strict();