import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapClaspTypeSchema } from '../enums/StrapClaspType.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumStrapClaspTypeFilterObjectSchema as NestedEnumStrapClaspTypeFilterObjectSchema } from './NestedEnumStrapClaspTypeFilter.schema'

const nestedenumstrapclasptypewithaggregatesfilterSchema = z.object({
  equals: StrapClaspTypeSchema.optional(),
  in: StrapClaspTypeSchema.array().optional(),
  notIn: StrapClaspTypeSchema.array().optional(),
  not: z.union([StrapClaspTypeSchema, z.lazy(() => NestedEnumStrapClaspTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStrapClaspTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStrapClaspTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumStrapClaspTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapClaspTypeWithAggregatesFilter> = nestedenumstrapclasptypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapClaspTypeWithAggregatesFilter>;
export const NestedEnumStrapClaspTypeWithAggregatesFilterObjectZodSchema = nestedenumstrapclasptypewithaggregatesfilterSchema;
