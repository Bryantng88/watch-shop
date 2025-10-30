import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PriceVisibilitySchema } from '../enums/PriceVisibility.schema';
import { NestedEnumPriceVisibilityWithAggregatesFilterObjectSchema as NestedEnumPriceVisibilityWithAggregatesFilterObjectSchema } from './NestedEnumPriceVisibilityWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumPriceVisibilityFilterObjectSchema as NestedEnumPriceVisibilityFilterObjectSchema } from './NestedEnumPriceVisibilityFilter.schema'

const makeSchema = () => z.object({
  equals: PriceVisibilitySchema.optional(),
  in: PriceVisibilitySchema.array().optional(),
  notIn: PriceVisibilitySchema.array().optional(),
  not: z.union([PriceVisibilitySchema, z.lazy(() => NestedEnumPriceVisibilityWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumPriceVisibilityFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumPriceVisibilityFilterObjectSchema).optional()
}).strict();
export const EnumPriceVisibilityWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumPriceVisibilityWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPriceVisibilityWithAggregatesFilter>;
export const EnumPriceVisibilityWithAggregatesFilterObjectZodSchema = makeSchema();
