import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GenderSchema } from '../enums/Gender.schema'

const nestedenumgenderfilterSchema = z.object({
  equals: GenderSchema.optional(),
  in: GenderSchema.array().optional(),
  notIn: GenderSchema.array().optional(),
  not: z.union([GenderSchema, z.lazy(() => NestedEnumGenderFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumGenderFilterObjectSchema: z.ZodType<Prisma.NestedEnumGenderFilter> = nestedenumgenderfilterSchema as unknown as z.ZodType<Prisma.NestedEnumGenderFilter>;
export const NestedEnumGenderFilterObjectZodSchema = nestedenumgenderfilterSchema;
