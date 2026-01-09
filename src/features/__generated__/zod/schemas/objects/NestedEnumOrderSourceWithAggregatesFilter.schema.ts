import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderSourceSchema } from '../enums/OrderSource.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumOrderSourceFilterObjectSchema as NestedEnumOrderSourceFilterObjectSchema } from './NestedEnumOrderSourceFilter.schema'

const nestedenumordersourcewithaggregatesfilterSchema = z.object({
  equals: OrderSourceSchema.optional(),
  in: OrderSourceSchema.array().optional(),
  notIn: OrderSourceSchema.array().optional(),
  not: z.union([OrderSourceSchema, z.lazy(() => NestedEnumOrderSourceWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumOrderSourceFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumOrderSourceFilterObjectSchema).optional()
}).strict();
export const NestedEnumOrderSourceWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumOrderSourceWithAggregatesFilter> = nestedenumordersourcewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumOrderSourceWithAggregatesFilter>;
export const NestedEnumOrderSourceWithAggregatesFilterObjectZodSchema = nestedenumordersourcewithaggregatesfilterSchema;
