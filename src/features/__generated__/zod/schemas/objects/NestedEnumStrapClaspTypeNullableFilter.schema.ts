import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapClaspTypeSchema } from '../enums/StrapClaspType.schema'

const nestedenumstrapclasptypenullablefilterSchema = z.object({
  equals: StrapClaspTypeSchema.optional().nullable(),
  in: StrapClaspTypeSchema.array().optional().nullable(),
  notIn: StrapClaspTypeSchema.array().optional().nullable(),
  not: z.union([StrapClaspTypeSchema, z.lazy(() => NestedEnumStrapClaspTypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumStrapClaspTypeNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumStrapClaspTypeNullableFilter> = nestedenumstrapclasptypenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumStrapClaspTypeNullableFilter>;
export const NestedEnumStrapClaspTypeNullableFilterObjectZodSchema = nestedenumstrapclasptypenullablefilterSchema;
