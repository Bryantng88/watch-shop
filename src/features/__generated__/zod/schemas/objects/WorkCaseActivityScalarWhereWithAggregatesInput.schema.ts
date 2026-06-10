import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const workcaseactivityscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => WorkCaseActivityScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WorkCaseActivityScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WorkCaseActivityScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WorkCaseActivityScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WorkCaseActivityScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  workCaseId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  actorId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  action: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  note: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const WorkCaseActivityScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityScalarWhereWithAggregatesInput> = workcaseactivityscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.WorkCaseActivityScalarWhereWithAggregatesInput>;
export const WorkCaseActivityScalarWhereWithAggregatesInputObjectZodSchema = workcaseactivityscalarwherewithaggregatesinputSchema;
