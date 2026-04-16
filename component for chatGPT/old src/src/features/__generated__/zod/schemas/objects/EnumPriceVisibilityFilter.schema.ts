import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PriceVisibilitySchema } from '../enums/PriceVisibility.schema';
import { NestedEnumPriceVisibilityFilterObjectSchema as NestedEnumPriceVisibilityFilterObjectSchema } from './NestedEnumPriceVisibilityFilter.schema'

const makeSchema = () => z.object({
  equals: PriceVisibilitySchema.optional(),
  in: PriceVisibilitySchema.array().optional(),
  notIn: PriceVisibilitySchema.array().optional(),
  not: z.union([PriceVisibilitySchema, z.lazy(() => NestedEnumPriceVisibilityFilterObjectSchema)]).optional()
}).strict();
export const EnumPriceVisibilityFilterObjectSchema: z.ZodType<Prisma.EnumPriceVisibilityFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumPriceVisibilityFilter>;
export const EnumPriceVisibilityFilterObjectZodSchema = makeSchema();
