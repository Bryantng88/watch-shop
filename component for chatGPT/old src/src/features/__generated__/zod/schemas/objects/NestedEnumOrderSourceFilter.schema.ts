import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderSourceSchema } from '../enums/OrderSource.schema'

const nestedenumordersourcefilterSchema = z.object({
  equals: OrderSourceSchema.optional(),
  in: OrderSourceSchema.array().optional(),
  notIn: OrderSourceSchema.array().optional(),
  not: z.union([OrderSourceSchema, z.lazy(() => NestedEnumOrderSourceFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumOrderSourceFilterObjectSchema: z.ZodType<Prisma.NestedEnumOrderSourceFilter> = nestedenumordersourcefilterSchema as unknown as z.ZodType<Prisma.NestedEnumOrderSourceFilter>;
export const NestedEnumOrderSourceFilterObjectZodSchema = nestedenumordersourcefilterSchema;
