import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { NestedEnumMovementTypeFilterObjectSchema as NestedEnumMovementTypeFilterObjectSchema } from './NestedEnumMovementTypeFilter.schema'

const makeSchema = () => z.object({
  equals: MovementTypeSchema.optional(),
  in: MovementTypeSchema.array().optional(),
  notIn: MovementTypeSchema.array().optional(),
  not: z.union([MovementTypeSchema, z.lazy(() => NestedEnumMovementTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumMovementTypeFilterObjectSchema: z.ZodType<Prisma.EnumMovementTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMovementTypeFilter>;
export const EnumMovementTypeFilterObjectZodSchema = makeSchema();
