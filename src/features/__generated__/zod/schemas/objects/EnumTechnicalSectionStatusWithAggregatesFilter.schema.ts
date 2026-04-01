import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalSectionStatusSchema } from '../enums/TechnicalSectionStatus.schema';
import { NestedEnumTechnicalSectionStatusWithAggregatesFilterObjectSchema as NestedEnumTechnicalSectionStatusWithAggregatesFilterObjectSchema } from './NestedEnumTechnicalSectionStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTechnicalSectionStatusFilterObjectSchema as NestedEnumTechnicalSectionStatusFilterObjectSchema } from './NestedEnumTechnicalSectionStatusFilter.schema'

const makeSchema = () => z.object({
  equals: TechnicalSectionStatusSchema.optional(),
  in: TechnicalSectionStatusSchema.array().optional(),
  notIn: TechnicalSectionStatusSchema.array().optional(),
  not: z.union([TechnicalSectionStatusSchema, z.lazy(() => NestedEnumTechnicalSectionStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTechnicalSectionStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTechnicalSectionStatusFilterObjectSchema).optional()
}).strict();
export const EnumTechnicalSectionStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumTechnicalSectionStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTechnicalSectionStatusWithAggregatesFilter>;
export const EnumTechnicalSectionStatusWithAggregatesFilterObjectZodSchema = makeSchema();
