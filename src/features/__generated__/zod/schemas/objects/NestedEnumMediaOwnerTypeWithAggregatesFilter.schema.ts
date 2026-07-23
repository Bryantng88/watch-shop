import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOwnerTypeSchema } from '../enums/MediaOwnerType.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMediaOwnerTypeFilterObjectSchema as NestedEnumMediaOwnerTypeFilterObjectSchema } from './NestedEnumMediaOwnerTypeFilter.schema'

const nestedenummediaownertypewithaggregatesfilterSchema = z.object({
  equals: MediaOwnerTypeSchema.optional(),
  in: MediaOwnerTypeSchema.array().optional(),
  notIn: MediaOwnerTypeSchema.array().optional(),
  not: z.union([MediaOwnerTypeSchema, z.lazy(() => NestedEnumMediaOwnerTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMediaOwnerTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMediaOwnerTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumMediaOwnerTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumMediaOwnerTypeWithAggregatesFilter> = nestedenummediaownertypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumMediaOwnerTypeWithAggregatesFilter>;
export const NestedEnumMediaOwnerTypeWithAggregatesFilterObjectZodSchema = nestedenummediaownertypewithaggregatesfilterSchema;
