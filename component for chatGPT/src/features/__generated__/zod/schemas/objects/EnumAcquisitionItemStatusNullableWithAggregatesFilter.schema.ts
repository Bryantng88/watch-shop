import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemStatusSchema } from '../enums/AcquisitionItemStatus.schema';
import { NestedEnumAcquisitionItemStatusNullableWithAggregatesFilterObjectSchema as NestedEnumAcquisitionItemStatusNullableWithAggregatesFilterObjectSchema } from './NestedEnumAcquisitionItemStatusNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumAcquisitionItemStatusNullableFilterObjectSchema as NestedEnumAcquisitionItemStatusNullableFilterObjectSchema } from './NestedEnumAcquisitionItemStatusNullableFilter.schema'

const makeSchema = () => z.object({
  equals: AcquisitionItemStatusSchema.optional().nullable(),
  in: AcquisitionItemStatusSchema.array().optional().nullable(),
  notIn: AcquisitionItemStatusSchema.array().optional().nullable(),
  not: z.union([AcquisitionItemStatusSchema, z.lazy(() => NestedEnumAcquisitionItemStatusNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumAcquisitionItemStatusNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumAcquisitionItemStatusNullableFilterObjectSchema).optional()
}).strict();
export const EnumAcquisitionItemStatusNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumAcquisitionItemStatusNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumAcquisitionItemStatusNullableWithAggregatesFilter>;
export const EnumAcquisitionItemStatusNullableWithAggregatesFilterObjectZodSchema = makeSchema();
