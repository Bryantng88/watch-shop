import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapLengthClassSchema } from '../enums/StrapLengthClass.schema';
import { NestedEnumStrapLengthClassNullableWithAggregatesFilterObjectSchema as NestedEnumStrapLengthClassNullableWithAggregatesFilterObjectSchema } from './NestedEnumStrapLengthClassNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumStrapLengthClassNullableFilterObjectSchema as NestedEnumStrapLengthClassNullableFilterObjectSchema } from './NestedEnumStrapLengthClassNullableFilter.schema'

const makeSchema = () => z.object({
  equals: StrapLengthClassSchema.optional().nullable(),
  in: StrapLengthClassSchema.array().optional().nullable(),
  notIn: StrapLengthClassSchema.array().optional().nullable(),
  not: z.union([StrapLengthClassSchema, z.lazy(() => NestedEnumStrapLengthClassNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStrapLengthClassNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStrapLengthClassNullableFilterObjectSchema).optional()
}).strict();
export const EnumStrapLengthClassNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumStrapLengthClassNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapLengthClassNullableWithAggregatesFilter>;
export const EnumStrapLengthClassNullableWithAggregatesFilterObjectZodSchema = makeSchema();
