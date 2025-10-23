import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionStatusSchema } from '../enums/AcquisitionStatus.schema'

const nestedenumacquisitionstatusfilterSchema = z.object({
  equals: AcquisitionStatusSchema.optional(),
  in: AcquisitionStatusSchema.array().optional(),
  notIn: AcquisitionStatusSchema.array().optional(),
  not: z.union([AcquisitionStatusSchema, z.lazy(() => NestedEnumAcquisitionStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumAcquisitionStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumAcquisitionStatusFilter> = nestedenumacquisitionstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumAcquisitionStatusFilter>;
export const NestedEnumAcquisitionStatusFilterObjectZodSchema = nestedenumacquisitionstatusfilterSchema;
