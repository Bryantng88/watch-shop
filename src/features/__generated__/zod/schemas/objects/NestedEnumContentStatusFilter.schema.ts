import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ContentStatusSchema } from '../enums/ContentStatus.schema'

const nestedenumcontentstatusfilterSchema = z.object({
  equals: ContentStatusSchema.optional(),
  in: ContentStatusSchema.array().optional(),
  notIn: ContentStatusSchema.array().optional(),
  not: z.union([ContentStatusSchema, z.lazy(() => NestedEnumContentStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumContentStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumContentStatusFilter> = nestedenumcontentstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumContentStatusFilter>;
export const NestedEnumContentStatusFilterObjectZodSchema = nestedenumcontentstatusfilterSchema;
