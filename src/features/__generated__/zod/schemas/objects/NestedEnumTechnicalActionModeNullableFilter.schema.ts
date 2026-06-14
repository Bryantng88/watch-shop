import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema'

const nestedenumtechnicalactionmodenullablefilterSchema = z.object({
  equals: TechnicalActionModeSchema.optional().nullable(),
  in: TechnicalActionModeSchema.array().optional().nullable(),
  notIn: TechnicalActionModeSchema.array().optional().nullable(),
  not: z.union([TechnicalActionModeSchema, z.lazy(() => NestedEnumTechnicalActionModeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumTechnicalActionModeNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumTechnicalActionModeNullableFilter> = nestedenumtechnicalactionmodenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumTechnicalActionModeNullableFilter>;
export const NestedEnumTechnicalActionModeNullableFilterObjectZodSchema = nestedenumtechnicalactionmodenullablefilterSchema;
