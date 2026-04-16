import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalMovementKindSchema } from '../enums/TechnicalMovementKind.schema';
import { NestedEnumTechnicalMovementKindFilterObjectSchema as NestedEnumTechnicalMovementKindFilterObjectSchema } from './NestedEnumTechnicalMovementKindFilter.schema'

const makeSchema = () => z.object({
  equals: TechnicalMovementKindSchema.optional(),
  in: TechnicalMovementKindSchema.array().optional(),
  notIn: TechnicalMovementKindSchema.array().optional(),
  not: z.union([TechnicalMovementKindSchema, z.lazy(() => NestedEnumTechnicalMovementKindFilterObjectSchema)]).optional()
}).strict();
export const EnumTechnicalMovementKindFilterObjectSchema: z.ZodType<Prisma.EnumTechnicalMovementKindFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTechnicalMovementKindFilter>;
export const EnumTechnicalMovementKindFilterObjectZodSchema = makeSchema();
