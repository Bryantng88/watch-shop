import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandStatusSchema } from '../enums/BrandStatus.schema';
import { NestedEnumBrandStatusFilterObjectSchema as NestedEnumBrandStatusFilterObjectSchema } from './NestedEnumBrandStatusFilter.schema'

const makeSchema = () => z.object({
  equals: BrandStatusSchema.optional(),
  in: BrandStatusSchema.array().optional(),
  notIn: BrandStatusSchema.array().optional(),
  not: z.union([BrandStatusSchema, z.lazy(() => NestedEnumBrandStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumBrandStatusFilterObjectSchema: z.ZodType<Prisma.EnumBrandStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumBrandStatusFilter>;
export const EnumBrandStatusFilterObjectZodSchema = makeSchema();
