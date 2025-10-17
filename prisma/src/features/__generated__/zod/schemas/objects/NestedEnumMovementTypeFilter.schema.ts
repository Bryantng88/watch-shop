import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MovementTypeSchema } from '../enums/MovementType.schema'

const nestedenummovementtypefilterSchema = z.object({
  equals: MovementTypeSchema.optional(),
  in: MovementTypeSchema.array().optional(),
  notIn: MovementTypeSchema.array().optional(),
  not: z.union([MovementTypeSchema, z.lazy(() => NestedEnumMovementTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumMovementTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumMovementTypeFilter> = nestedenummovementtypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumMovementTypeFilter>;
export const NestedEnumMovementTypeFilterObjectZodSchema = nestedenummovementtypefilterSchema;
