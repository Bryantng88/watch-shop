import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemKindSchema } from '../enums/OrderItemKind.schema';
import { NestedEnumOrderItemKindWithAggregatesFilterObjectSchema as NestedEnumOrderItemKindWithAggregatesFilterObjectSchema } from './NestedEnumOrderItemKindWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumOrderItemKindFilterObjectSchema as NestedEnumOrderItemKindFilterObjectSchema } from './NestedEnumOrderItemKindFilter.schema'

const makeSchema = () => z.object({
  equals: OrderItemKindSchema.optional(),
  in: OrderItemKindSchema.array().optional(),
  notIn: OrderItemKindSchema.array().optional(),
  not: z.union([OrderItemKindSchema, z.lazy(() => NestedEnumOrderItemKindWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumOrderItemKindFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumOrderItemKindFilterObjectSchema).optional()
}).strict();
export const EnumOrderItemKindWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumOrderItemKindWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumOrderItemKindWithAggregatesFilter>;
export const EnumOrderItemKindWithAggregatesFilterObjectZodSchema = makeSchema();
