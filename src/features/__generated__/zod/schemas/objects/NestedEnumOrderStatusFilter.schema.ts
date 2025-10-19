import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderStatusSchema } from '../enums/OrderStatus.schema'

const nestedenumorderstatusfilterSchema = z.object({
  equals: OrderStatusSchema.optional(),
  in: OrderStatusSchema.array().optional(),
  notIn: OrderStatusSchema.array().optional(),
  not: z.union([OrderStatusSchema, z.lazy(() => NestedEnumOrderStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumOrderStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumOrderStatusFilter> = nestedenumorderstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumOrderStatusFilter>;
export const NestedEnumOrderStatusFilterObjectZodSchema = nestedenumorderstatusfilterSchema;
