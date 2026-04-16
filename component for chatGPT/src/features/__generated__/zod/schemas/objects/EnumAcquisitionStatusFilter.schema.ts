import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionStatusSchema } from '../enums/AcquisitionStatus.schema';
import { NestedEnumAcquisitionStatusFilterObjectSchema as NestedEnumAcquisitionStatusFilterObjectSchema } from './NestedEnumAcquisitionStatusFilter.schema'

const makeSchema = () => z.object({
  equals: AcquisitionStatusSchema.optional(),
  in: AcquisitionStatusSchema.array().optional(),
  notIn: AcquisitionStatusSchema.array().optional(),
  not: z.union([AcquisitionStatusSchema, z.lazy(() => NestedEnumAcquisitionStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumAcquisitionStatusFilterObjectSchema: z.ZodType<Prisma.EnumAcquisitionStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumAcquisitionStatusFilter>;
export const EnumAcquisitionStatusFilterObjectZodSchema = makeSchema();
