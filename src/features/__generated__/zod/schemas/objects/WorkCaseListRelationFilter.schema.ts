import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereInputObjectSchema as WorkCaseWhereInputObjectSchema } from './WorkCaseWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => WorkCaseWhereInputObjectSchema).optional(),
  some: z.lazy(() => WorkCaseWhereInputObjectSchema).optional(),
  none: z.lazy(() => WorkCaseWhereInputObjectSchema).optional()
}).strict();
export const WorkCaseListRelationFilterObjectSchema: z.ZodType<Prisma.WorkCaseListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseListRelationFilter>;
export const WorkCaseListRelationFilterObjectZodSchema = makeSchema();
