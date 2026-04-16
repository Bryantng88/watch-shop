import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { NestedEnumTechnicalActionModeWithAggregatesFilterObjectSchema as NestedEnumTechnicalActionModeWithAggregatesFilterObjectSchema } from './NestedEnumTechnicalActionModeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTechnicalActionModeFilterObjectSchema as NestedEnumTechnicalActionModeFilterObjectSchema } from './NestedEnumTechnicalActionModeFilter.schema'

const makeSchema = () => z.object({
  equals: TechnicalActionModeSchema.optional(),
  in: TechnicalActionModeSchema.array().optional(),
  notIn: TechnicalActionModeSchema.array().optional(),
  not: z.union([TechnicalActionModeSchema, z.lazy(() => NestedEnumTechnicalActionModeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTechnicalActionModeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTechnicalActionModeFilterObjectSchema).optional()
}).strict();
export const EnumTechnicalActionModeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumTechnicalActionModeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTechnicalActionModeWithAggregatesFilter>;
export const EnumTechnicalActionModeWithAggregatesFilterObjectZodSchema = makeSchema();
