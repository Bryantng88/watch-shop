import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapOriginTypeSchema } from '../enums/StrapOriginType.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumStrapOriginTypeNullableFilterObjectSchema as NestedEnumStrapOriginTypeNullableFilterObjectSchema } from './NestedEnumStrapOriginTypeNullableFilter.schema'

const nestedenumstraporigintypenullablewithaggregatesfilterSchema = z.object({
  equals: StrapOriginTypeSchema.optional().nullable(),
  in: StrapOriginTypeSchema.array().optional().nullable(),
  notIn: StrapOriginTypeSchema.array().optional().nullable(),
  not: z.union([StrapOriginTypeSchema, z.lazy(() => NestedEnumStrapOriginTypeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStrapOriginTypeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStrapOriginTypeNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumStrapOriginTypeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapOriginTypeNullableWithAggregatesFilter> = nestedenumstraporigintypenullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapOriginTypeNullableWithAggregatesFilter>;
export const NestedEnumStrapOriginTypeNullableWithAggregatesFilterObjectZodSchema = nestedenumstraporigintypenullablewithaggregatesfilterSchema;
