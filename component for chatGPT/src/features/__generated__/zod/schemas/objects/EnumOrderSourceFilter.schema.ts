import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderSourceSchema } from '../enums/OrderSource.schema';
import { NestedEnumOrderSourceFilterObjectSchema as NestedEnumOrderSourceFilterObjectSchema } from './NestedEnumOrderSourceFilter.schema'

const makeSchema = () => z.object({
  equals: OrderSourceSchema.optional(),
  in: OrderSourceSchema.array().optional(),
  notIn: OrderSourceSchema.array().optional(),
  not: z.union([OrderSourceSchema, z.lazy(() => NestedEnumOrderSourceFilterObjectSchema)]).optional()
}).strict();
export const EnumOrderSourceFilterObjectSchema: z.ZodType<Prisma.EnumOrderSourceFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumOrderSourceFilter>;
export const EnumOrderSourceFilterObjectZodSchema = makeSchema();
