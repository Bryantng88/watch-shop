import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GenderSchema } from '../enums/Gender.schema'

const nestedenumgendernullablefilterSchema = z.object({
  equals: GenderSchema.optional().nullable(),
  in: GenderSchema.array().optional().nullable(),
  notIn: GenderSchema.array().optional().nullable(),
  not: z.union([GenderSchema, z.lazy(() => NestedEnumGenderNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumGenderNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumGenderNullableFilter> = nestedenumgendernullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumGenderNullableFilter>;
export const NestedEnumGenderNullableFilterObjectZodSchema = nestedenumgendernullablefilterSchema;
