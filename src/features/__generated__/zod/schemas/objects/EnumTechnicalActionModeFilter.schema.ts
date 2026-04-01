import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { NestedEnumTechnicalActionModeFilterObjectSchema as NestedEnumTechnicalActionModeFilterObjectSchema } from './NestedEnumTechnicalActionModeFilter.schema'

const makeSchema = () => z.object({
  equals: TechnicalActionModeSchema.optional(),
  in: TechnicalActionModeSchema.array().optional(),
  notIn: TechnicalActionModeSchema.array().optional(),
  not: z.union([TechnicalActionModeSchema, z.lazy(() => NestedEnumTechnicalActionModeFilterObjectSchema)]).optional()
}).strict();
export const EnumTechnicalActionModeFilterObjectSchema: z.ZodType<Prisma.EnumTechnicalActionModeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTechnicalActionModeFilter>;
export const EnumTechnicalActionModeFilterObjectZodSchema = makeSchema();
