import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalSectionStatusSchema } from '../enums/TechnicalSectionStatus.schema';
import { NestedEnumTechnicalSectionStatusFilterObjectSchema as NestedEnumTechnicalSectionStatusFilterObjectSchema } from './NestedEnumTechnicalSectionStatusFilter.schema'

const makeSchema = () => z.object({
  equals: TechnicalSectionStatusSchema.optional(),
  in: TechnicalSectionStatusSchema.array().optional(),
  notIn: TechnicalSectionStatusSchema.array().optional(),
  not: z.union([TechnicalSectionStatusSchema, z.lazy(() => NestedEnumTechnicalSectionStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumTechnicalSectionStatusFilterObjectSchema: z.ZodType<Prisma.EnumTechnicalSectionStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTechnicalSectionStatusFilter>;
export const EnumTechnicalSectionStatusFilterObjectZodSchema = makeSchema();
