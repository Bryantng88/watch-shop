import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const productposttargetscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => ProductPostTargetScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ProductPostTargetScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProductPostTargetScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProductPostTargetScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ProductPostTargetScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  productId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  postTargetId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const ProductPostTargetScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.ProductPostTargetScalarWhereWithAggregatesInput> = productposttargetscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.ProductPostTargetScalarWhereWithAggregatesInput>;
export const ProductPostTargetScalarWhereWithAggregatesInputObjectZodSchema = productposttargetscalarwherewithaggregatesinputSchema;
