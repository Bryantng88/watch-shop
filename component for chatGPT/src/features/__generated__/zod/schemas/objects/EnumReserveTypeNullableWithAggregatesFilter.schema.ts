import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ReserveTypeSchema } from '../enums/ReserveType.schema';
import { NestedEnumReserveTypeNullableWithAggregatesFilterObjectSchema as NestedEnumReserveTypeNullableWithAggregatesFilterObjectSchema } from './NestedEnumReserveTypeNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumReserveTypeNullableFilterObjectSchema as NestedEnumReserveTypeNullableFilterObjectSchema } from './NestedEnumReserveTypeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: ReserveTypeSchema.optional().nullable(),
  in: ReserveTypeSchema.array().optional().nullable(),
  notIn: ReserveTypeSchema.array().optional().nullable(),
  not: z.union([ReserveTypeSchema, z.lazy(() => NestedEnumReserveTypeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumReserveTypeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumReserveTypeNullableFilterObjectSchema).optional()
}).strict();
export const EnumReserveTypeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumReserveTypeNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumReserveTypeNullableWithAggregatesFilter>;
export const EnumReserveTypeNullableWithAggregatesFilterObjectZodSchema = makeSchema();
