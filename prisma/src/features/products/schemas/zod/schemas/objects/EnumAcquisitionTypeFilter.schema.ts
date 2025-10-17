import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionTypeSchema } from '../enums/AcquisitionType.schema';
import { NestedEnumAcquisitionTypeFilterObjectSchema as NestedEnumAcquisitionTypeFilterObjectSchema } from './NestedEnumAcquisitionTypeFilter.schema'

const makeSchema = () => z.object({
  equals: AcquisitionTypeSchema.optional(),
  in: AcquisitionTypeSchema.array().optional(),
  notIn: AcquisitionTypeSchema.array().optional(),
  not: z.union([AcquisitionTypeSchema, z.lazy(() => NestedEnumAcquisitionTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumAcquisitionTypeFilterObjectSchema: z.ZodType<Prisma.EnumAcquisitionTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumAcquisitionTypeFilter>;
export const EnumAcquisitionTypeFilterObjectZodSchema = makeSchema();
