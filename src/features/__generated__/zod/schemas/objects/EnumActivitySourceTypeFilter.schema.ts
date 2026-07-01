import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ActivitySourceTypeSchema } from '../enums/ActivitySourceType.schema';
import { NestedEnumActivitySourceTypeFilterObjectSchema as NestedEnumActivitySourceTypeFilterObjectSchema } from './NestedEnumActivitySourceTypeFilter.schema'

const makeSchema = () => z.object({
  equals: ActivitySourceTypeSchema.optional(),
  in: ActivitySourceTypeSchema.array().optional(),
  notIn: ActivitySourceTypeSchema.array().optional(),
  not: z.union([ActivitySourceTypeSchema, z.lazy(() => NestedEnumActivitySourceTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumActivitySourceTypeFilterObjectSchema: z.ZodType<Prisma.EnumActivitySourceTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumActivitySourceTypeFilter>;
export const EnumActivitySourceTypeFilterObjectZodSchema = makeSchema();
