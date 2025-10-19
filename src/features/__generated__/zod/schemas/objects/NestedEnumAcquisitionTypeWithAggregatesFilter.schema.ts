import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionTypeSchema } from '../enums/AcquisitionType.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumAcquisitionTypeFilterObjectSchema as NestedEnumAcquisitionTypeFilterObjectSchema } from './NestedEnumAcquisitionTypeFilter.schema'

const nestedenumacquisitiontypewithaggregatesfilterSchema = z.object({
  equals: AcquisitionTypeSchema.optional(),
  in: AcquisitionTypeSchema.array().optional(),
  notIn: AcquisitionTypeSchema.array().optional(),
  not: z.union([AcquisitionTypeSchema, z.lazy(() => NestedEnumAcquisitionTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumAcquisitionTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumAcquisitionTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumAcquisitionTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumAcquisitionTypeWithAggregatesFilter> = nestedenumacquisitiontypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumAcquisitionTypeWithAggregatesFilter>;
export const NestedEnumAcquisitionTypeWithAggregatesFilterObjectZodSchema = nestedenumacquisitiontypewithaggregatesfilterSchema;
