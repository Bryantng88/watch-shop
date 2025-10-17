import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandStatusSchema } from '../enums/BrandStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumBrandStatusFilterObjectSchema as NestedEnumBrandStatusFilterObjectSchema } from './NestedEnumBrandStatusFilter.schema'

const nestedenumbrandstatuswithaggregatesfilterSchema = z.object({
  equals: BrandStatusSchema.optional(),
  in: BrandStatusSchema.array().optional(),
  notIn: BrandStatusSchema.array().optional(),
  not: z.union([BrandStatusSchema, z.lazy(() => NestedEnumBrandStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumBrandStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumBrandStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumBrandStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumBrandStatusWithAggregatesFilter> = nestedenumbrandstatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumBrandStatusWithAggregatesFilter>;
export const NestedEnumBrandStatusWithAggregatesFilterObjectZodSchema = nestedenumbrandstatuswithaggregatesfilterSchema;
