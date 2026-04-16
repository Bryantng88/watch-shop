import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PriceVisibilitySchema } from '../enums/PriceVisibility.schema'

const nestedenumpricevisibilityfilterSchema = z.object({
  equals: PriceVisibilitySchema.optional(),
  in: PriceVisibilitySchema.array().optional(),
  notIn: PriceVisibilitySchema.array().optional(),
  not: z.union([PriceVisibilitySchema, z.lazy(() => NestedEnumPriceVisibilityFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumPriceVisibilityFilterObjectSchema: z.ZodType<Prisma.NestedEnumPriceVisibilityFilter> = nestedenumpricevisibilityfilterSchema as unknown as z.ZodType<Prisma.NestedEnumPriceVisibilityFilter>;
export const NestedEnumPriceVisibilityFilterObjectZodSchema = nestedenumpricevisibilityfilterSchema;
