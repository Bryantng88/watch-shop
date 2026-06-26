import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagTargetTypeSchema } from '../enums/AppTagTargetType.schema';
import { NestedEnumAppTagTargetTypeWithAggregatesFilterObjectSchema as NestedEnumAppTagTargetTypeWithAggregatesFilterObjectSchema } from './NestedEnumAppTagTargetTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumAppTagTargetTypeFilterObjectSchema as NestedEnumAppTagTargetTypeFilterObjectSchema } from './NestedEnumAppTagTargetTypeFilter.schema'

const makeSchema = () => z.object({
  equals: AppTagTargetTypeSchema.optional(),
  in: AppTagTargetTypeSchema.array().optional(),
  notIn: AppTagTargetTypeSchema.array().optional(),
  not: z.union([AppTagTargetTypeSchema, z.lazy(() => NestedEnumAppTagTargetTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumAppTagTargetTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumAppTagTargetTypeFilterObjectSchema).optional()
}).strict();
export const EnumAppTagTargetTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumAppTagTargetTypeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumAppTagTargetTypeWithAggregatesFilter>;
export const EnumAppTagTargetTypeWithAggregatesFilterObjectZodSchema = makeSchema();
