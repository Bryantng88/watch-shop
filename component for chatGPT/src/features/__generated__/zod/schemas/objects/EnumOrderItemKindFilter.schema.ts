import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemKindSchema } from '../enums/OrderItemKind.schema';
import { NestedEnumOrderItemKindFilterObjectSchema as NestedEnumOrderItemKindFilterObjectSchema } from './NestedEnumOrderItemKindFilter.schema'

const makeSchema = () => z.object({
  equals: OrderItemKindSchema.optional(),
  in: OrderItemKindSchema.array().optional(),
  notIn: OrderItemKindSchema.array().optional(),
  not: z.union([OrderItemKindSchema, z.lazy(() => NestedEnumOrderItemKindFilterObjectSchema)]).optional()
}).strict();
export const EnumOrderItemKindFilterObjectSchema: z.ZodType<Prisma.EnumOrderItemKindFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumOrderItemKindFilter>;
export const EnumOrderItemKindFilterObjectZodSchema = makeSchema();
