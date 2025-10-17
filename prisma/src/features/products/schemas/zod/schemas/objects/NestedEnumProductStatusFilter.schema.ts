import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductStatusSchema } from '../enums/ProductStatus.schema'

const nestedenumproductstatusfilterSchema = z.object({
  equals: ProductStatusSchema.optional(),
  in: ProductStatusSchema.array().optional(),
  notIn: ProductStatusSchema.array().optional(),
  not: z.union([ProductStatusSchema, z.lazy(() => NestedEnumProductStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumProductStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumProductStatusFilter> = nestedenumproductstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumProductStatusFilter>;
export const NestedEnumProductStatusFilterObjectZodSchema = nestedenumproductstatusfilterSchema;
