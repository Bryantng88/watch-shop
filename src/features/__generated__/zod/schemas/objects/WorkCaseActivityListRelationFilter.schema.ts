import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseActivityWhereInputObjectSchema as WorkCaseActivityWhereInputObjectSchema } from './WorkCaseActivityWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => WorkCaseActivityWhereInputObjectSchema).optional(),
  some: z.lazy(() => WorkCaseActivityWhereInputObjectSchema).optional(),
  none: z.lazy(() => WorkCaseActivityWhereInputObjectSchema).optional()
}).strict();
export const WorkCaseActivityListRelationFilterObjectSchema: z.ZodType<Prisma.WorkCaseActivityListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityListRelationFilter>;
export const WorkCaseActivityListRelationFilterObjectZodSchema = makeSchema();
