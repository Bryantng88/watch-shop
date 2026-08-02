import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapOriginTypeSchema } from '../enums/StrapOriginType.schema';
import { NestedEnumStrapOriginTypeNullableWithAggregatesFilterObjectSchema as NestedEnumStrapOriginTypeNullableWithAggregatesFilterObjectSchema } from './NestedEnumStrapOriginTypeNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumStrapOriginTypeNullableFilterObjectSchema as NestedEnumStrapOriginTypeNullableFilterObjectSchema } from './NestedEnumStrapOriginTypeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: StrapOriginTypeSchema.optional().nullable(),
  in: StrapOriginTypeSchema.array().optional().nullable(),
  notIn: StrapOriginTypeSchema.array().optional().nullable(),
  not: z.union([StrapOriginTypeSchema, z.lazy(() => NestedEnumStrapOriginTypeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStrapOriginTypeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStrapOriginTypeNullableFilterObjectSchema).optional()
}).strict();
export const EnumStrapOriginTypeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumStrapOriginTypeNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapOriginTypeNullableWithAggregatesFilter>;
export const EnumStrapOriginTypeNullableWithAggregatesFilterObjectZodSchema = makeSchema();
