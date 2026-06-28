import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateWhereInputObjectSchema as WorkflowTemplateWhereInputObjectSchema } from './WorkflowTemplateWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => WorkflowTemplateWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => WorkflowTemplateWhereInputObjectSchema).optional().nullable()
}).strict();
export const WorkflowTemplateNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.WorkflowTemplateNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateNullableScalarRelationFilter>;
export const WorkflowTemplateNullableScalarRelationFilterObjectZodSchema = makeSchema();
