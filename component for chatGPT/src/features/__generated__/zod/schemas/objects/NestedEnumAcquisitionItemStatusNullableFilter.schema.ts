import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemStatusSchema } from '../enums/AcquisitionItemStatus.schema'

const nestedenumacquisitionitemstatusnullablefilterSchema = z.object({
  equals: AcquisitionItemStatusSchema.optional().nullable(),
  in: AcquisitionItemStatusSchema.array().optional().nullable(),
  notIn: AcquisitionItemStatusSchema.array().optional().nullable(),
  not: z.union([AcquisitionItemStatusSchema, z.lazy(() => NestedEnumAcquisitionItemStatusNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumAcquisitionItemStatusNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumAcquisitionItemStatusNullableFilter> = nestedenumacquisitionitemstatusnullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumAcquisitionItemStatusNullableFilter>;
export const NestedEnumAcquisitionItemStatusNullableFilterObjectZodSchema = nestedenumacquisitionitemstatusnullablefilterSchema;
