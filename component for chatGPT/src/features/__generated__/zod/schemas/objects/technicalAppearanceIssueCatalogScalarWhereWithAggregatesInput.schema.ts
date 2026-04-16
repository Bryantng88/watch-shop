import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const technicalappearanceissuecatalogscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => technicalAppearanceIssueCatalogScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => technicalAppearanceIssueCatalogScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => technicalAppearanceIssueCatalogScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => technicalAppearanceIssueCatalogScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => technicalAppearanceIssueCatalogScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  area: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  label: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  deductionScore: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  sortOrder: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  isActive: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  note: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const technicalAppearanceIssueCatalogScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogScalarWhereWithAggregatesInput> = technicalappearanceissuecatalogscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogScalarWhereWithAggregatesInput>;
export const technicalAppearanceIssueCatalogScalarWhereWithAggregatesInputObjectZodSchema = technicalappearanceissuecatalogscalarwherewithaggregatesinputSchema;
