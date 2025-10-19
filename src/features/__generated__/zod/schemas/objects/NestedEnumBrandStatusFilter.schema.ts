import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandStatusSchema } from '../enums/BrandStatus.schema'

const nestedenumbrandstatusfilterSchema = z.object({
  equals: BrandStatusSchema.optional(),
  in: BrandStatusSchema.array().optional(),
  notIn: BrandStatusSchema.array().optional(),
  not: z.union([BrandStatusSchema, z.lazy(() => NestedEnumBrandStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumBrandStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumBrandStatusFilter> = nestedenumbrandstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumBrandStatusFilter>;
export const NestedEnumBrandStatusFilterObjectZodSchema = nestedenumbrandstatusfilterSchema;
