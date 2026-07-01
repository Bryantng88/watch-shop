import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ActivitySourceTypeSchema } from '../enums/ActivitySourceType.schema'

const nestedenumactivitysourcetypefilterSchema = z.object({
  equals: ActivitySourceTypeSchema.optional(),
  in: ActivitySourceTypeSchema.array().optional(),
  notIn: ActivitySourceTypeSchema.array().optional(),
  not: z.union([ActivitySourceTypeSchema, z.lazy(() => NestedEnumActivitySourceTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumActivitySourceTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumActivitySourceTypeFilter> = nestedenumactivitysourcetypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumActivitySourceTypeFilter>;
export const NestedEnumActivitySourceTypeFilterObjectZodSchema = nestedenumactivitysourcetypefilterSchema;
