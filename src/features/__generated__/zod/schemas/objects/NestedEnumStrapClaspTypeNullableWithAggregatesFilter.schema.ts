import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapClaspTypeSchema } from '../enums/StrapClaspType.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumStrapClaspTypeNullableFilterObjectSchema as NestedEnumStrapClaspTypeNullableFilterObjectSchema } from './NestedEnumStrapClaspTypeNullableFilter.schema'

const nestedenumstrapclasptypenullablewithaggregatesfilterSchema = z.object({
  equals: StrapClaspTypeSchema.optional().nullable(),
  in: StrapClaspTypeSchema.array().optional().nullable(),
  notIn: StrapClaspTypeSchema.array().optional().nullable(),
  not: z.union([StrapClaspTypeSchema, z.lazy(() => NestedEnumStrapClaspTypeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStrapClaspTypeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStrapClaspTypeNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumStrapClaspTypeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapClaspTypeNullableWithAggregatesFilter> = nestedenumstrapclasptypenullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapClaspTypeNullableWithAggregatesFilter>;
export const NestedEnumStrapClaspTypeNullableWithAggregatesFilterObjectZodSchema = nestedenumstrapclasptypenullablewithaggregatesfilterSchema;
