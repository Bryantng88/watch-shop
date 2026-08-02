import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumStrapCatalogOptionKindWithAggregatesFilterObjectSchema as EnumStrapCatalogOptionKindWithAggregatesFilterObjectSchema } from './EnumStrapCatalogOptionKindWithAggregatesFilter.schema';
import { StrapCatalogOptionKindSchema } from '../enums/StrapCatalogOptionKind.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const strapcatalogoptionscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => StrapCatalogOptionScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => StrapCatalogOptionScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => StrapCatalogOptionScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => StrapCatalogOptionScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => StrapCatalogOptionScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  kind: z.union([z.lazy(() => EnumStrapCatalogOptionKindWithAggregatesFilterObjectSchema), StrapCatalogOptionKindSchema]).optional(),
  code: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  colorHex: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  isActive: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  sortOrder: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const StrapCatalogOptionScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.StrapCatalogOptionScalarWhereWithAggregatesInput> = strapcatalogoptionscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.StrapCatalogOptionScalarWhereWithAggregatesInput>;
export const StrapCatalogOptionScalarWhereWithAggregatesInputObjectZodSchema = strapcatalogoptionscalarwherewithaggregatesinputSchema;
