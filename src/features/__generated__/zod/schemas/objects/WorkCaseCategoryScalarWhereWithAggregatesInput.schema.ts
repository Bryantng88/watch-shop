import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumWorkCaseScopeWithAggregatesFilterObjectSchema as EnumWorkCaseScopeWithAggregatesFilterObjectSchema } from './EnumWorkCaseScopeWithAggregatesFilter.schema';
import { WorkCaseScopeSchema } from '../enums/WorkCaseScope.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const workcasecategoryscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => WorkCaseCategoryScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WorkCaseCategoryScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WorkCaseCategoryScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WorkCaseCategoryScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => WorkCaseCategoryScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  scope: z.union([z.lazy(() => EnumWorkCaseScopeWithAggregatesFilterObjectSchema), WorkCaseScopeSchema]).optional(),
  isActive: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  sortOrder: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const WorkCaseCategoryScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.WorkCaseCategoryScalarWhereWithAggregatesInput> = workcasecategoryscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.WorkCaseCategoryScalarWhereWithAggregatesInput>;
export const WorkCaseCategoryScalarWhereWithAggregatesInputObjectZodSchema = workcasecategoryscalarwherewithaggregatesinputSchema;
