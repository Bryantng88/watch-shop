import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTechnicalActionModeFilterObjectSchema as NestedEnumTechnicalActionModeFilterObjectSchema } from './NestedEnumTechnicalActionModeFilter.schema'

const nestedenumtechnicalactionmodewithaggregatesfilterSchema = z.object({
  equals: TechnicalActionModeSchema.optional(),
  in: TechnicalActionModeSchema.array().optional(),
  notIn: TechnicalActionModeSchema.array().optional(),
  not: z.union([TechnicalActionModeSchema, z.lazy(() => NestedEnumTechnicalActionModeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTechnicalActionModeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTechnicalActionModeFilterObjectSchema).optional()
}).strict();
export const NestedEnumTechnicalActionModeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumTechnicalActionModeWithAggregatesFilter> = nestedenumtechnicalactionmodewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTechnicalActionModeWithAggregatesFilter>;
export const NestedEnumTechnicalActionModeWithAggregatesFilterObjectZodSchema = nestedenumtechnicalactionmodewithaggregatesfilterSchema;
