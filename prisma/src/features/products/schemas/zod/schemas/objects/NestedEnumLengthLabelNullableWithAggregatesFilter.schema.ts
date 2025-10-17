import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { LengthLabelSchema } from '../enums/LengthLabel.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumLengthLabelNullableFilterObjectSchema as NestedEnumLengthLabelNullableFilterObjectSchema } from './NestedEnumLengthLabelNullableFilter.schema'

const nestedenumlengthlabelnullablewithaggregatesfilterSchema = z.object({
  equals: LengthLabelSchema.optional().nullable(),
  in: LengthLabelSchema.array().optional().nullable(),
  notIn: LengthLabelSchema.array().optional().nullable(),
  not: z.union([LengthLabelSchema, z.lazy(() => NestedEnumLengthLabelNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumLengthLabelNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumLengthLabelNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumLengthLabelNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumLengthLabelNullableWithAggregatesFilter> = nestedenumlengthlabelnullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumLengthLabelNullableWithAggregatesFilter>;
export const NestedEnumLengthLabelNullableWithAggregatesFilterObjectZodSchema = nestedenumlengthlabelnullablewithaggregatesfilterSchema;
