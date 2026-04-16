import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ContentStatusSchema } from '../enums/ContentStatus.schema';
import { NestedEnumContentStatusFilterObjectSchema as NestedEnumContentStatusFilterObjectSchema } from './NestedEnumContentStatusFilter.schema'

const makeSchema = () => z.object({
  equals: ContentStatusSchema.optional(),
  in: ContentStatusSchema.array().optional(),
  notIn: ContentStatusSchema.array().optional(),
  not: z.union([ContentStatusSchema, z.lazy(() => NestedEnumContentStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumContentStatusFilterObjectSchema: z.ZodType<Prisma.EnumContentStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumContentStatusFilter>;
export const EnumContentStatusFilterObjectZodSchema = makeSchema();
