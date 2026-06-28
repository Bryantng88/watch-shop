import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WorkflowTemplateSelectObjectSchema as WorkflowTemplateSelectObjectSchema } from './objects/WorkflowTemplateSelect.schema';
import { WorkflowTemplateCreateManyInputObjectSchema as WorkflowTemplateCreateManyInputObjectSchema } from './objects/WorkflowTemplateCreateManyInput.schema';

export const WorkflowTemplateCreateManyAndReturnSchema: z.ZodType<Prisma.WorkflowTemplateCreateManyAndReturnArgs> = z.object({ select: WorkflowTemplateSelectObjectSchema.optional(), data: z.union([ WorkflowTemplateCreateManyInputObjectSchema, z.array(WorkflowTemplateCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WorkflowTemplateCreateManyAndReturnArgs>;

export const WorkflowTemplateCreateManyAndReturnZodSchema = z.object({ select: WorkflowTemplateSelectObjectSchema.optional(), data: z.union([ WorkflowTemplateCreateManyInputObjectSchema, z.array(WorkflowTemplateCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();