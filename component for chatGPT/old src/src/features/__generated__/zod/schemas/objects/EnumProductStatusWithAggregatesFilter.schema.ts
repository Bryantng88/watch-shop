import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductStatusSchema } from '../enums/ProductStatus.schema';
import { NestedEnumProductStatusWithAggregatesFilterObjectSchema as NestedEnumProductStatusWithAggregatesFilterObjectSchema } from './NestedEnumProductStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumProductStatusFilterObjectSchema as NestedEnumProductStatusFilterObjectSchema } from './NestedEnumProductStatusFilter.schema'

const makeSchema = () => z.object({
  equals: ProductStatusSchema.optional(),
  in: ProductStatusSchema.array().optional(),
  notIn: ProductStatusSchema.array().optional(),
  not: z.union([ProductStatusSchema, z.lazy(() => NestedEnumProductStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumProductStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumProductStatusFilterObjectSchema).optional()
}).strict();
export const EnumProductStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumProductStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumProductStatusWithAggregatesFilter>;
export const EnumProductStatusWithAggregatesFilterObjectZodSchema = makeSchema();
