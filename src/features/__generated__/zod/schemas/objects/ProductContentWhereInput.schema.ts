import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProductScalarRelationFilterObjectSchema as ProductScalarRelationFilterObjectSchema } from './ProductScalarRelationFilter.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const productcontentwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ProductContentWhereInputObjectSchema), z.lazy(() => ProductContentWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProductContentWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProductContentWhereInputObjectSchema), z.lazy(() => ProductContentWhereInputObjectSchema).array()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  titleSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  brandSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  refSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sizeSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  movementSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  glassSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  strapClaspSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  modelSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  yearSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  generatedContent: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  promptNote: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  generatedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  Product: z.union([z.lazy(() => ProductScalarRelationFilterObjectSchema), z.lazy(() => ProductWhereInputObjectSchema)]).optional()
}).strict();
export const ProductContentWhereInputObjectSchema: z.ZodType<Prisma.ProductContentWhereInput> = productcontentwhereinputSchema as unknown as z.ZodType<Prisma.ProductContentWhereInput>;
export const ProductContentWhereInputObjectZodSchema = productcontentwhereinputSchema;
