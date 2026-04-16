import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalSectionStatusSchema } from '../enums/TechnicalSectionStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTechnicalSectionStatusFilterObjectSchema as NestedEnumTechnicalSectionStatusFilterObjectSchema } from './NestedEnumTechnicalSectionStatusFilter.schema'

const nestedenumtechnicalsectionstatuswithaggregatesfilterSchema = z.object({
  equals: TechnicalSectionStatusSchema.optional(),
  in: TechnicalSectionStatusSchema.array().optional(),
  notIn: TechnicalSectionStatusSchema.array().optional(),
  not: z.union([TechnicalSectionStatusSchema, z.lazy(() => NestedEnumTechnicalSectionStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTechnicalSectionStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTechnicalSectionStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumTechnicalSectionStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumTechnicalSectionStatusWithAggregatesFilter> = nestedenumtechnicalsectionstatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTechnicalSectionStatusWithAggregatesFilter>;
export const NestedEnumTechnicalSectionStatusWithAggregatesFilterObjectZodSchema = nestedenumtechnicalsectionstatuswithaggregatesfilterSchema;
