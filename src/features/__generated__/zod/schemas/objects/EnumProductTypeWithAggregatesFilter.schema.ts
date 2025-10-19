import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { NestedEnumProductTypeWithAggregatesFilterObjectSchema as NestedEnumProductTypeWithAggregatesFilterObjectSchema } from './NestedEnumProductTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumProductTypeFilterObjectSchema as NestedEnumProductTypeFilterObjectSchema } from './NestedEnumProductTypeFilter.schema'

const makeSchema = () => z.object({
  equals: ProductTypeSchema.optional(),
  in: ProductTypeSchema.array().optional(),
  notIn: ProductTypeSchema.array().optional(),
  not: z.union([ProductTypeSchema, z.lazy(() => NestedEnumProductTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumProductTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumProductTypeFilterObjectSchema).optional()
}).strict();
export const EnumProductTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumProductTypeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumProductTypeWithAggregatesFilter>;
export const EnumProductTypeWithAggregatesFilterObjectZodSchema = makeSchema();
