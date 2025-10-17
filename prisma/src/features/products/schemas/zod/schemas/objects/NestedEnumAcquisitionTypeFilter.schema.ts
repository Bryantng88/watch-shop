import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionTypeSchema } from '../enums/AcquisitionType.schema'

const nestedenumacquisitiontypefilterSchema = z.object({
  equals: AcquisitionTypeSchema.optional(),
  in: AcquisitionTypeSchema.array().optional(),
  notIn: AcquisitionTypeSchema.array().optional(),
  not: z.union([AcquisitionTypeSchema, z.lazy(() => NestedEnumAcquisitionTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumAcquisitionTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumAcquisitionTypeFilter> = nestedenumacquisitiontypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumAcquisitionTypeFilter>;
export const NestedEnumAcquisitionTypeFilterObjectZodSchema = nestedenumacquisitiontypefilterSchema;
