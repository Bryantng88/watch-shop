import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowTemplateCreateManyInputObjectSchema as WorkflowTemplateCreateManyInputObjectSchema } from './objects/WorkflowTemplateCreateManyInput.schema';

export const WorkflowTemplateCreateManySchema: z.ZodType<Prisma.WorkflowTemplateCreateManyArgs> = z.object({ data: z.union([ WorkflowTemplateCreateManyInputObjectSchema, z.array(WorkflowTemplateCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowTemplateCreateManyArgs>;

export const WorkflowTemplateCreateManyZodSchema = z.object({ data: z.union([ WorkflowTemplateCreateManyInputObjectSchema, z.array(WorkflowTemplateCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();