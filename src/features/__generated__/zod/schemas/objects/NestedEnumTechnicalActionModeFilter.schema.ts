import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema'

const nestedenumtechnicalactionmodefilterSchema = z.object({
  equals: TechnicalActionModeSchema.optional(),
  in: TechnicalActionModeSchema.array().optional(),
  notIn: TechnicalActionModeSchema.array().optional(),
  not: z.union([TechnicalActionModeSchema, z.lazy(() => NestedEnumTechnicalActionModeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumTechnicalActionModeFilterObjectSchema: z.ZodType<Prisma.NestedEnumTechnicalActionModeFilter> = nestedenumtechnicalactionmodefilterSchema as unknown as z.ZodType<Prisma.NestedEnumTechnicalActionModeFilter>;
export const NestedEnumTechnicalActionModeFilterObjectZodSchema = nestedenumtechnicalactionmodefilterSchema;
