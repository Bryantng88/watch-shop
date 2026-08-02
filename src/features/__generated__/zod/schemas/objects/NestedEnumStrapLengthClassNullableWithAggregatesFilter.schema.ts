import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapLengthClassSchema } from '../enums/StrapLengthClass.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumStrapLengthClassNullableFilterObjectSchema as NestedEnumStrapLengthClassNullableFilterObjectSchema } from './NestedEnumStrapLengthClassNullableFilter.schema'

const nestedenumstraplengthclassnullablewithaggregatesfilterSchema = z.object({
  equals: StrapLengthClassSchema.optional().nullable(),
  in: StrapLengthClassSchema.array().optional().nullable(),
  notIn: StrapLengthClassSchema.array().optional().nullable(),
  not: z.union([StrapLengthClassSchema, z.lazy(() => NestedEnumStrapLengthClassNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStrapLengthClassNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStrapLengthClassNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumStrapLengthClassNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapLengthClassNullableWithAggregatesFilter> = nestedenumstraplengthclassnullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapLengthClassNullableWithAggregatesFilter>;
export const NestedEnumStrapLengthClassNullableWithAggregatesFilterObjectZodSchema = nestedenumstraplengthclassnullablewithaggregatesfilterSchema;
