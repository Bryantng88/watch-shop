import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderStatusSchema } from '../enums/OrderStatus.schema';
import { NestedEnumOrderStatusFilterObjectSchema as NestedEnumOrderStatusFilterObjectSchema } from './NestedEnumOrderStatusFilter.schema'

const makeSchema = () => z.object({
  equals: OrderStatusSchema.optional(),
  in: OrderStatusSchema.array().optional(),
  notIn: OrderStatusSchema.array().optional(),
  not: z.union([OrderStatusSchema, z.lazy(() => NestedEnumOrderStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumOrderStatusFilterObjectSchema: z.ZodType<Prisma.EnumOrderStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumOrderStatusFilter>;
export const EnumOrderStatusFilterObjectZodSchema = makeSchema();
