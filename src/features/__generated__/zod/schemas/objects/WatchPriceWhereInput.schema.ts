import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { WatchScalarRelationFilterObjectSchema as WatchScalarRelationFilterObjectSchema } from './WatchScalarRelationFilter.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema'

const watchpricewhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WatchPriceWhereInputObjectSchema), z.lazy(() => WatchPriceWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WatchPriceWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WatchPriceWhereInputObjectSchema), z.lazy(() => WatchPriceWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  watchId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  costPrice: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  serviceCost: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  landedCost: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  listPrice: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  salePrice: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  minPrice: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  pricingNote: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  watch: z.union([z.lazy(() => WatchScalarRelationFilterObjectSchema), z.lazy(() => WatchWhereInputObjectSchema)]).optional()
}).strict();
export const WatchPriceWhereInputObjectSchema: z.ZodType<Prisma.WatchPriceWhereInput> = watchpricewhereinputSchema as unknown as z.ZodType<Prisma.WatchPriceWhereInput>;
export const WatchPriceWhereInputObjectZodSchema = watchpricewhereinputSchema;
