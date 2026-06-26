import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagTargetTypeSchema } from '../enums/AppTagTargetType.schema'

const nestedenumapptagtargettypefilterSchema = z.object({
  equals: AppTagTargetTypeSchema.optional(),
  in: AppTagTargetTypeSchema.array().optional(),
  notIn: AppTagTargetTypeSchema.array().optional(),
  not: z.union([AppTagTargetTypeSchema, z.lazy(() => NestedEnumAppTagTargetTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumAppTagTargetTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumAppTagTargetTypeFilter> = nestedenumapptagtargettypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumAppTagTargetTypeFilter>;
export const NestedEnumAppTagTargetTypeFilterObjectZodSchema = nestedenumapptagtargettypefilterSchema;
