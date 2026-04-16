import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { NestedEnumMovementTypeNullableWithAggregatesFilterObjectSchema as NestedEnumMovementTypeNullableWithAggregatesFilterObjectSchema } from './NestedEnumMovementTypeNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumMovementTypeNullableFilterObjectSchema as NestedEnumMovementTypeNullableFilterObjectSchema } from './NestedEnumMovementTypeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: MovementTypeSchema.optional().nullable(),
  in: MovementTypeSchema.array().optional().nullable(),
  notIn: MovementTypeSchema.array().optional().nullable(),
  not: z.union([MovementTypeSchema, z.lazy(() => NestedEnumMovementTypeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMovementTypeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMovementTypeNullableFilterObjectSchema).optional()
}).strict();
export const EnumMovementTypeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumMovementTypeNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMovementTypeNullableWithAggregatesFilter>;
export const EnumMovementTypeNullableWithAggregatesFilterObjectZodSchema = makeSchema();
