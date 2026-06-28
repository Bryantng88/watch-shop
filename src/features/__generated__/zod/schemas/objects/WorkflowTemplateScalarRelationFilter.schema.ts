import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateWhereInputObjectSchema as WorkflowTemplateWhereInputObjectSchema } from './WorkflowTemplateWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => WorkflowTemplateWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => WorkflowTemplateWhereInputObjectSchema).optional()
}).strict();
export const WorkflowTemplateScalarRelationFilterObjectSchema: z.ZodType<Prisma.WorkflowTemplateScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateScalarRelationFilter>;
export const WorkflowTemplateScalarRelationFilterObjectZodSchema = makeSchema();
