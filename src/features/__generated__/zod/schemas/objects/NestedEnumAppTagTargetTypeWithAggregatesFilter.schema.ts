import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagTargetTypeSchema } from '../enums/AppTagTargetType.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumAppTagTargetTypeFilterObjectSchema as NestedEnumAppTagTargetTypeFilterObjectSchema } from './NestedEnumAppTagTargetTypeFilter.schema'

const nestedenumapptagtargettypewithaggregatesfilterSchema = z.object({
  equals: AppTagTargetTypeSchema.optional(),
  in: AppTagTargetTypeSchema.array().optional(),
  notIn: AppTagTargetTypeSchema.array().optional(),
  not: z.union([AppTagTargetTypeSchema, z.lazy(() => NestedEnumAppTagTargetTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumAppTagTargetTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumAppTagTargetTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumAppTagTargetTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumAppTagTargetTypeWithAggregatesFilter> = nestedenumapptagtargettypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumAppTagTargetTypeWithAggregatesFilter>;
export const NestedEnumAppTagTargetTypeWithAggregatesFilterObjectZodSchema = nestedenumapptagtargettypewithaggregatesfilterSchema;
