import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const productcontentscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => ProductContentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ProductContentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProductContentScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProductContentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ProductContentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  productId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  titleSnapshot: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  brandSnapshot: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  refSnapshot: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  sizeSnapshot: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  movementSnapshot: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  glassSnapshot: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  strapClaspSnapshot: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  modelSnapshot: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  yearSnapshot: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  generatedContent: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  promptNote: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  generatedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const ProductContentScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.ProductContentScalarWhereWithAggregatesInput> = productcontentscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.ProductContentScalarWhereWithAggregatesInput>;
export const ProductContentScalarWhereWithAggregatesInputObjectZodSchema = productcontentscalarwherewithaggregatesinputSchema;
