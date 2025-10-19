import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { LengthLabelSchema } from '../enums/LengthLabel.schema';
import { NestedEnumLengthLabelNullableWithAggregatesFilterObjectSchema as NestedEnumLengthLabelNullableWithAggregatesFilterObjectSchema } from './NestedEnumLengthLabelNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumLengthLabelNullableFilterObjectSchema as NestedEnumLengthLabelNullableFilterObjectSchema } from './NestedEnumLengthLabelNullableFilter.schema'

const makeSchema = () => z.object({
  equals: LengthLabelSchema.optional().nullable(),
  in: LengthLabelSchema.array().optional().nullable(),
  notIn: LengthLabelSchema.array().optional().nullable(),
  not: z.union([LengthLabelSchema, z.lazy(() => NestedEnumLengthLabelNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumLengthLabelNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumLengthLabelNullableFilterObjectSchema).optional()
}).strict();
export const EnumLengthLabelNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumLengthLabelNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumLengthLabelNullableWithAggregatesFilter>;
export const EnumLengthLabelNullableWithAggregatesFilterObjectZodSchema = makeSchema();
