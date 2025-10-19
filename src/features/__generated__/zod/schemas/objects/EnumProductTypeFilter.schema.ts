import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { NestedEnumProductTypeFilterObjectSchema as NestedEnumProductTypeFilterObjectSchema } from './NestedEnumProductTypeFilter.schema'

const makeSchema = () => z.object({
  equals: ProductTypeSchema.optional(),
  in: ProductTypeSchema.array().optional(),
  notIn: ProductTypeSchema.array().optional(),
  not: z.union([ProductTypeSchema, z.lazy(() => NestedEnumProductTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumProductTypeFilterObjectSchema: z.ZodType<Prisma.EnumProductTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumProductTypeFilter>;
export const EnumProductTypeFilterObjectZodSchema = makeSchema();
