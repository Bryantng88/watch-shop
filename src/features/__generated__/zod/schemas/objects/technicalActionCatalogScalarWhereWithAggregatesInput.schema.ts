import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const technicalactioncatalogscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => technicalActionCatalogScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => technicalActionCatalogScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => technicalActionCatalogScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => technicalActionCatalogScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => technicalActionCatalogScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  appliesTo: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  groupKey: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  requiresPart: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  defaultExecutionMode: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  sortOrder: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  isActive: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  note: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const technicalActionCatalogScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.technicalActionCatalogScalarWhereWithAggregatesInput> = technicalactioncatalogscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.technicalActionCatalogScalarWhereWithAggregatesInput>;
export const technicalActionCatalogScalarWhereWithAggregatesInputObjectZodSchema = technicalactioncatalogscalarwherewithaggregatesinputSchema;
