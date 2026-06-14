import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { NestedEnumTechnicalActionModeNullableWithAggregatesFilterObjectSchema as NestedEnumTechnicalActionModeNullableWithAggregatesFilterObjectSchema } from './NestedEnumTechnicalActionModeNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumTechnicalActionModeNullableFilterObjectSchema as NestedEnumTechnicalActionModeNullableFilterObjectSchema } from './NestedEnumTechnicalActionModeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: TechnicalActionModeSchema.optional().nullable(),
  in: TechnicalActionModeSchema.array().optional().nullable(),
  notIn: TechnicalActionModeSchema.array().optional().nullable(),
  not: z.union([TechnicalActionModeSchema, z.lazy(() => NestedEnumTechnicalActionModeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTechnicalActionModeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTechnicalActionModeNullableFilterObjectSchema).optional()
}).strict();
export const EnumTechnicalActionModeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumTechnicalActionModeNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTechnicalActionModeNullableWithAggregatesFilter>;
export const EnumTechnicalActionModeNullableWithAggregatesFilterObjectZodSchema = makeSchema();
