import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalSectionStatusSchema } from '../enums/TechnicalSectionStatus.schema'

const nestedenumtechnicalsectionstatusfilterSchema = z.object({
  equals: TechnicalSectionStatusSchema.optional(),
  in: TechnicalSectionStatusSchema.array().optional(),
  notIn: TechnicalSectionStatusSchema.array().optional(),
  not: z.union([TechnicalSectionStatusSchema, z.lazy(() => NestedEnumTechnicalSectionStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumTechnicalSectionStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumTechnicalSectionStatusFilter> = nestedenumtechnicalsectionstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTechnicalSectionStatusFilter>;
export const NestedEnumTechnicalSectionStatusFilterObjectZodSchema = nestedenumtechnicalsectionstatusfilterSchema;
