import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalMovementKindSchema } from '../enums/TechnicalMovementKind.schema';
import { NestedEnumTechnicalMovementKindWithAggregatesFilterObjectSchema as NestedEnumTechnicalMovementKindWithAggregatesFilterObjectSchema } from './NestedEnumTechnicalMovementKindWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTechnicalMovementKindFilterObjectSchema as NestedEnumTechnicalMovementKindFilterObjectSchema } from './NestedEnumTechnicalMovementKindFilter.schema'

const makeSchema = () => z.object({
  equals: TechnicalMovementKindSchema.optional(),
  in: TechnicalMovementKindSchema.array().optional(),
  notIn: TechnicalMovementKindSchema.array().optional(),
  not: z.union([TechnicalMovementKindSchema, z.lazy(() => NestedEnumTechnicalMovementKindWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTechnicalMovementKindFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTechnicalMovementKindFilterObjectSchema).optional()
}).strict();
export const EnumTechnicalMovementKindWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumTechnicalMovementKindWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTechnicalMovementKindWithAggregatesFilter>;
export const EnumTechnicalMovementKindWithAggregatesFilterObjectZodSchema = makeSchema();
