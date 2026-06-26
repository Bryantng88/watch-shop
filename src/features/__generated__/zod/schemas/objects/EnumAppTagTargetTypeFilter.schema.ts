import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagTargetTypeSchema } from '../enums/AppTagTargetType.schema';
import { NestedEnumAppTagTargetTypeFilterObjectSchema as NestedEnumAppTagTargetTypeFilterObjectSchema } from './NestedEnumAppTagTargetTypeFilter.schema'

const makeSchema = () => z.object({
  equals: AppTagTargetTypeSchema.optional(),
  in: AppTagTargetTypeSchema.array().optional(),
  notIn: AppTagTargetTypeSchema.array().optional(),
  not: z.union([AppTagTargetTypeSchema, z.lazy(() => NestedEnumAppTagTargetTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumAppTagTargetTypeFilterObjectSchema: z.ZodType<Prisma.EnumAppTagTargetTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumAppTagTargetTypeFilter>;
export const EnumAppTagTargetTypeFilterObjectZodSchema = makeSchema();
