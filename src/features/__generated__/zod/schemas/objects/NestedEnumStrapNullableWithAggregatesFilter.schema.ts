import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapSchema } from '../enums/Strap.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumStrapNullableFilterObjectSchema as NestedEnumStrapNullableFilterObjectSchema } from './NestedEnumStrapNullableFilter.schema'

const nestedenumstrapnullablewithaggregatesfilterSchema = z.object({
  equals: StrapSchema.optional().nullable(),
  in: StrapSchema.array().optional().nullable(),
  notIn: StrapSchema.array().optional().nullable(),
  not: z.union([StrapSchema, z.lazy(() => NestedEnumStrapNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStrapNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStrapNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumStrapNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapNullableWithAggregatesFilter> = nestedenumstrapnullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapNullableWithAggregatesFilter>;
export const NestedEnumStrapNullableWithAggregatesFilterObjectZodSchema = nestedenumstrapnullablewithaggregatesfilterSchema;
