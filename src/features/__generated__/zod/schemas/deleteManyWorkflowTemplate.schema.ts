import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowTemplateWhereInputObjectSchema as WorkflowTemplateWhereInputObjectSchema } from './objects/WorkflowTemplateWhereInput.schema';

export const WorkflowTemplateDeleteManySchema: z.ZodType<Prisma.WorkflowTemplateDeleteManyArgs> = z.object({ where: WorkflowTemplateWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowTemplateDeleteManyArgs>;

export const WorkflowTemplateDeleteManyZodSchema = z.object({ where: WorkflowTemplateWhereInputObjectSchema.optional() }).strict();