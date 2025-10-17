import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductTypeSchema } from '../enums/ProductType.schema'

const nestedenumproducttypefilterSchema = z.object({
  equals: ProductTypeSchema.optional(),
  in: ProductTypeSchema.array().optional(),
  notIn: ProductTypeSchema.array().optional(),
  not: z.union([ProductTypeSchema, z.lazy(() => NestedEnumProductTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumProductTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumProductTypeFilter> = nestedenumproducttypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumProductTypeFilter>;
export const NestedEnumProductTypeFilterObjectZodSchema = nestedenumproducttypefilterSchema;
