import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderStatusSchema } from '../enums/OrderStatus.schema';
import { NestedEnumOrderStatusWithAggregatesFilterObjectSchema as NestedEnumOrderStatusWithAggregatesFilterObjectSchema } from './NestedEnumOrderStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumOrderStatusFilterObjectSchema as NestedEnumOrderStatusFilterObjectSchema } from './NestedEnumOrderStatusFilter.schema'

const makeSchema = () => z.object({
  equals: OrderStatusSchema.optional(),
  in: OrderStatusSchema.array().optional(),
  notIn: OrderStatusSchema.array().optional(),
  not: z.union([OrderStatusSchema, z.lazy(() => NestedEnumOrderStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumOrderStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumOrderStatusFilterObjectSchema).optional()
}).strict();
export const EnumOrderStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumOrderStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumOrderStatusWithAggregatesFilter>;
export const EnumOrderStatusWithAggregatesFilterObjectZodSchema = makeSchema();
