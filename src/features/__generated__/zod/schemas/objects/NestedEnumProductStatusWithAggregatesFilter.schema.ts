import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductStatusSchema } from '../enums/ProductStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumProductStatusFilterObjectSchema as NestedEnumProductStatusFilterObjectSchema } from './NestedEnumProductStatusFilter.schema'

const nestedenumproductstatuswithaggregatesfilterSchema = z.object({
  equals: ProductStatusSchema.optional(),
  in: ProductStatusSchema.array().optional(),
  notIn: ProductStatusSchema.array().optional(),
  not: z.union([ProductStatusSchema, z.lazy(() => NestedEnumProductStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumProductStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumProductStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumProductStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumProductStatusWithAggregatesFilter> = nestedenumproductstatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumProductStatusWithAggregatesFilter>;
export const NestedEnumProductStatusWithAggregatesFilterObjectZodSchema = nestedenumproductstatuswithaggregatesfilterSchema;
