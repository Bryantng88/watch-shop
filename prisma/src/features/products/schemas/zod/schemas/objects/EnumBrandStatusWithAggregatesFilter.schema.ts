import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandStatusSchema } from '../enums/BrandStatus.schema';
import { NestedEnumBrandStatusWithAggregatesFilterObjectSchema as NestedEnumBrandStatusWithAggregatesFilterObjectSchema } from './NestedEnumBrandStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumBrandStatusFilterObjectSchema as NestedEnumBrandStatusFilterObjectSchema } from './NestedEnumBrandStatusFilter.schema'

const makeSchema = () => z.object({
  equals: BrandStatusSchema.optional(),
  in: BrandStatusSchema.array().optional(),
  notIn: BrandStatusSchema.array().optional(),
  not: z.union([BrandStatusSchema, z.lazy(() => NestedEnumBrandStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumBrandStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumBrandStatusFilterObjectSchema).optional()
}).strict();
export const EnumBrandStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumBrandStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumBrandStatusWithAggregatesFilter>;
export const EnumBrandStatusWithAggregatesFilterObjectZodSchema = makeSchema();
