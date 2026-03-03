import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemKindSchema } from '../enums/OrderItemKind.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumOrderItemKindFilterObjectSchema as NestedEnumOrderItemKindFilterObjectSchema } from './NestedEnumOrderItemKindFilter.schema'

const nestedenumorderitemkindwithaggregatesfilterSchema = z.object({
  equals: OrderItemKindSchema.optional(),
  in: OrderItemKindSchema.array().optional(),
  notIn: OrderItemKindSchema.array().optional(),
  not: z.union([OrderItemKindSchema, z.lazy(() => NestedEnumOrderItemKindWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumOrderItemKindFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumOrderItemKindFilterObjectSchema).optional()
}).strict();
export const NestedEnumOrderItemKindWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumOrderItemKindWithAggregatesFilter> = nestedenumorderitemkindwithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumOrderItemKindWithAggregatesFilter>;
export const NestedEnumOrderItemKindWithAggregatesFilterObjectZodSchema = nestedenumorderitemkindwithaggregatesfilterSchema;
