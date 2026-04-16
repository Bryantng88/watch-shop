import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalMovementKindSchema } from '../enums/TechnicalMovementKind.schema'

const nestedenumtechnicalmovementkindfilterSchema = z.object({
  equals: TechnicalMovementKindSchema.optional(),
  in: TechnicalMovementKindSchema.array().optional(),
  notIn: TechnicalMovementKindSchema.array().optional(),
  not: z.union([TechnicalMovementKindSchema, z.lazy(() => NestedEnumTechnicalMovementKindFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumTechnicalMovementKindFilterObjectSchema: z.ZodType<Prisma.NestedEnumTechnicalMovementKindFilter> = nestedenumtechnicalmovementkindfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTechnicalMovementKindFilter>;
export const NestedEnumTechnicalMovementKindFilterObjectZodSchema = nestedenumtechnicalmovementkindfilterSchema;
