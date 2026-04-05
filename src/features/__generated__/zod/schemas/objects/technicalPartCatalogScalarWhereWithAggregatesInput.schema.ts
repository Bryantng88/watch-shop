import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const technicalpartcatalogscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => technicalPartCatalogScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => technicalPartCatalogScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => technicalPartCatalogScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => technicalPartCatalogScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => technicalPartCatalogScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  appliesTo: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  partGroup: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  sortOrder: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  isActive: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  note: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const technicalPartCatalogScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.technicalPartCatalogScalarWhereWithAggregatesInput> = technicalpartcatalogscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.technicalPartCatalogScalarWhereWithAggregatesInput>;
export const technicalPartCatalogScalarWhereWithAggregatesInputObjectZodSchema = technicalpartcatalogscalarwherewithaggregatesinputSchema;
