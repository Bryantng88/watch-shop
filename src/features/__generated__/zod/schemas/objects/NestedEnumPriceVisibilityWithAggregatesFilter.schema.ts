import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PriceVisibilitySchema } from '../enums/PriceVisibility.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumPriceVisibilityFilterObjectSchema as NestedEnumPriceVisibilityFilterObjectSchema } from './NestedEnumPriceVisibilityFilter.schema'

const nestedenumpricevisibilitywithaggregatesfilterSchema = z.object({
  equals: PriceVisibilitySchema.optional(),
  in: PriceVisibilitySchema.array().optional(),
  notIn: PriceVisibilitySchema.array().optional(),
  not: z.union([PriceVisibilitySchema, z.lazy(() => NestedEnumPriceVisibilityWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumPriceVisibilityFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumPriceVisibilityFilterObjectSchema).optional()
}).strict();
export const NestedEnumPriceVisibilityWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumPriceVisibilityWithAggregatesFilter> = nestedenumpricevisibilitywithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumPriceVisibilityWithAggregatesFilter>;
export const NestedEnumPriceVisibilityWithAggregatesFilterObjectZodSchema = nestedenumpricevisibilitywithaggregatesfilterSchema;
