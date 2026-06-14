import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { NestedEnumTechnicalActionModeNullableFilterObjectSchema as NestedEnumTechnicalActionModeNullableFilterObjectSchema } from './NestedEnumTechnicalActionModeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: TechnicalActionModeSchema.optional().nullable(),
  in: TechnicalActionModeSchema.array().optional().nullable(),
  notIn: TechnicalActionModeSchema.array().optional().nullable(),
  not: z.union([TechnicalActionModeSchema, z.lazy(() => NestedEnumTechnicalActionModeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumTechnicalActionModeNullableFilterObjectSchema: z.ZodType<Prisma.EnumTechnicalActionModeNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTechnicalActionModeNullableFilter>;
export const EnumTechnicalActionModeNullableFilterObjectZodSchema = makeSchema();
