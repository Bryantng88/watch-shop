import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemStatusSchema } from '../enums/AcquisitionItemStatus.schema';
import { NestedEnumAcquisitionItemStatusNullableFilterObjectSchema as NestedEnumAcquisitionItemStatusNullableFilterObjectSchema } from './NestedEnumAcquisitionItemStatusNullableFilter.schema'

const makeSchema = () => z.object({
  equals: AcquisitionItemStatusSchema.optional().nullable(),
  in: AcquisitionItemStatusSchema.array().optional().nullable(),
  notIn: AcquisitionItemStatusSchema.array().optional().nullable(),
  not: z.union([AcquisitionItemStatusSchema, z.lazy(() => NestedEnumAcquisitionItemStatusNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumAcquisitionItemStatusNullableFilterObjectSchema: z.ZodType<Prisma.EnumAcquisitionItemStatusNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumAcquisitionItemStatusNullableFilter>;
export const EnumAcquisitionItemStatusNullableFilterObjectZodSchema = makeSchema();
