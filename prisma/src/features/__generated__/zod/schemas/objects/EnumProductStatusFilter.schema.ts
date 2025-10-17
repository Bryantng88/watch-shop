import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductStatusSchema } from '../enums/ProductStatus.schema';
import { NestedEnumProductStatusFilterObjectSchema as NestedEnumProductStatusFilterObjectSchema } from './NestedEnumProductStatusFilter.schema'

const makeSchema = () => z.object({
  equals: ProductStatusSchema.optional(),
  in: ProductStatusSchema.array().optional(),
  notIn: ProductStatusSchema.array().optional(),
  not: z.union([ProductStatusSchema, z.lazy(() => NestedEnumProductStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumProductStatusFilterObjectSchema: z.ZodType<Prisma.EnumProductStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumProductStatusFilter>;
export const EnumProductStatusFilterObjectZodSchema = makeSchema();
