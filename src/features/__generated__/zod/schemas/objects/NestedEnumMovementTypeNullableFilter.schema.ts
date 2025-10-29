import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MovementTypeSchema } from '../enums/MovementType.schema'

const nestedenummovementtypenullablefilterSchema = z.object({
  equals: MovementTypeSchema.optional().nullable(),
  in: MovementTypeSchema.array().optional().nullable(),
  notIn: MovementTypeSchema.array().optional().nullable(),
  not: z.union([MovementTypeSchema, z.lazy(() => NestedEnumMovementTypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumMovementTypeNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumMovementTypeNullableFilter> = nestedenummovementtypenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumMovementTypeNullableFilter>;
export const NestedEnumMovementTypeNullableFilterObjectZodSchema = nestedenummovementtypenullablefilterSchema;
