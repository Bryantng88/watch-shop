import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionStatusSchema } from '../enums/AcquisitionStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumAcquisitionStatusFilterObjectSchema as NestedEnumAcquisitionStatusFilterObjectSchema } from './NestedEnumAcquisitionStatusFilter.schema'

const nestedenumacquisitionstatuswithaggregatesfilterSchema = z.object({
  equals: AcquisitionStatusSchema.optional(),
  in: AcquisitionStatusSchema.array().optional(),
  notIn: AcquisitionStatusSchema.array().optional(),
  not: z.union([AcquisitionStatusSchema, z.lazy(() => NestedEnumAcquisitionStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumAcquisitionStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumAcquisitionStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumAcquisitionStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumAcquisitionStatusWithAggregatesFilter> = nestedenumacquisitionstatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumAcquisitionStatusWithAggregatesFilter>;
export const NestedEnumAcquisitionStatusWithAggregatesFilterObjectZodSchema = nestedenumacquisitionstatuswithaggregatesfilterSchema;
