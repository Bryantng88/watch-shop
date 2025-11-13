import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemStatusSchema } from '../enums/AcquisitionItemStatus.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumAcquisitionItemStatusNullableFilterObjectSchema as NestedEnumAcquisitionItemStatusNullableFilterObjectSchema } from './NestedEnumAcquisitionItemStatusNullableFilter.schema'

const nestedenumacquisitionitemstatusnullablewithaggregatesfilterSchema = z.object({
  equals: AcquisitionItemStatusSchema.optional().nullable(),
  in: AcquisitionItemStatusSchema.array().optional().nullable(),
  notIn: AcquisitionItemStatusSchema.array().optional().nullable(),
  not: z.union([AcquisitionItemStatusSchema, z.lazy(() => NestedEnumAcquisitionItemStatusNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumAcquisitionItemStatusNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumAcquisitionItemStatusNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumAcquisitionItemStatusNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumAcquisitionItemStatusNullableWithAggregatesFilter> = nestedenumacquisitionitemstatusnullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumAcquisitionItemStatusNullableWithAggregatesFilter>;
export const NestedEnumAcquisitionItemStatusNullableWithAggregatesFilterObjectZodSchema = nestedenumacquisitionitemstatusnullablewithaggregatesfilterSchema;
