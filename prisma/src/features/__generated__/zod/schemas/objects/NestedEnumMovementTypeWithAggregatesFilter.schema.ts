import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMovementTypeFilterObjectSchema as NestedEnumMovementTypeFilterObjectSchema } from './NestedEnumMovementTypeFilter.schema'

const nestedenummovementtypewithaggregatesfilterSchema = z.object({
  equals: MovementTypeSchema.optional(),
  in: MovementTypeSchema.array().optional(),
  notIn: MovementTypeSchema.array().optional(),
  not: z.union([MovementTypeSchema, z.lazy(() => NestedEnumMovementTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMovementTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMovementTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumMovementTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumMovementTypeWithAggregatesFilter> = nestedenummovementtypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumMovementTypeWithAggregatesFilter>;
export const NestedEnumMovementTypeWithAggregatesFilterObjectZodSchema = nestedenummovementtypewithaggregatesfilterSchema;
