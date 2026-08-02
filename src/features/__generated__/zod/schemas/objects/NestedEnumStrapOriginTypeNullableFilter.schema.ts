import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapOriginTypeSchema } from '../enums/StrapOriginType.schema'

const nestedenumstraporigintypenullablefilterSchema = z.object({
  equals: StrapOriginTypeSchema.optional().nullable(),
  in: StrapOriginTypeSchema.array().optional().nullable(),
  notIn: StrapOriginTypeSchema.array().optional().nullable(),
  not: z.union([StrapOriginTypeSchema, z.lazy(() => NestedEnumStrapOriginTypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumStrapOriginTypeNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapOriginTypeNullableFilter> = nestedenumstraporigintypenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapOriginTypeNullableFilter>;
export const NestedEnumStrapOriginTypeNullableFilterObjectZodSchema = nestedenumstraporigintypenullablefilterSchema;
