import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ContentStatusSchema } from '../enums/ContentStatus.schema'

const nestedenumcontentstatusnullablefilterSchema = z.object({
  equals: ContentStatusSchema.optional().nullable(),
  in: ContentStatusSchema.array().optional().nullable(),
  notIn: ContentStatusSchema.array().optional().nullable(),
  not: z.union([ContentStatusSchema, z.lazy(() => NestedEnumContentStatusNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumContentStatusNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumContentStatusNullableFilter> = nestedenumcontentstatusnullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumContentStatusNullableFilter>;
export const NestedEnumContentStatusNullableFilterObjectZodSchema = nestedenumcontentstatusnullablefilterSchema;
