import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MovementTypeSchema } from '../enums/MovementType.schema';
import { NestedEnumMovementTypeNullableFilterObjectSchema as NestedEnumMovementTypeNullableFilterObjectSchema } from './NestedEnumMovementTypeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: MovementTypeSchema.optional().nullable(),
  in: MovementTypeSchema.array().optional().nullable(),
  notIn: MovementTypeSchema.array().optional().nullable(),
  not: z.union([MovementTypeSchema, z.lazy(() => NestedEnumMovementTypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumMovementTypeNullableFilterObjectSchema: z.ZodType<Prisma.EnumMovementTypeNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMovementTypeNullableFilter>;
export const EnumMovementTypeNullableFilterObjectZodSchema = makeSchema();
