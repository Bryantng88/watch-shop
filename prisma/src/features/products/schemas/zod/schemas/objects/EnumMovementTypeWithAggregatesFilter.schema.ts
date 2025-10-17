import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { NestedEnumMovementTypeWithAggregatesFilterObjectSchema as NestedEnumMovementTypeWithAggregatesFilterObjectSchema } from './NestedEnumMovementTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMovementTypeFilterObjectSchema as NestedEnumMovementTypeFilterObjectSchema } from './NestedEnumMovementTypeFilter.schema'

const makeSchema = () => z.object({
  equals: MovementTypeSchema.optional(),
  in: MovementTypeSchema.array().optional(),
  notIn: MovementTypeSchema.array().optional(),
  not: z.union([MovementTypeSchema, z.lazy(() => NestedEnumMovementTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMovementTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMovementTypeFilterObjectSchema).optional()
}).strict();
export const EnumMovementTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumMovementTypeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMovementTypeWithAggregatesFilter>;
export const EnumMovementTypeWithAggregatesFilterObjectZodSchema = makeSchema();
