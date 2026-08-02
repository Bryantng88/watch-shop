import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapOriginTypeSchema } from '../enums/StrapOriginType.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumStrapOriginTypeFilterObjectSchema as NestedEnumStrapOriginTypeFilterObjectSchema } from './NestedEnumStrapOriginTypeFilter.schema'

const nestedenumstraporigintypewithaggregatesfilterSchema = z.object({
  equals: StrapOriginTypeSchema.optional(),
  in: StrapOriginTypeSchema.array().optional(),
  notIn: StrapOriginTypeSchema.array().optional(),
  not: z.union([StrapOriginTypeSchema, z.lazy(() => NestedEnumStrapOriginTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStrapOriginTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStrapOriginTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumStrapOriginTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapOriginTypeWithAggregatesFilter> = nestedenumstraporigintypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapOriginTypeWithAggregatesFilter>;
export const NestedEnumStrapOriginTypeWithAggregatesFilterObjectZodSchema = nestedenumstraporigintypewithaggregatesfilterSchema;
