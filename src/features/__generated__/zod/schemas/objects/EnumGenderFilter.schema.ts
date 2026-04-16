import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GenderSchema } from '../enums/Gender.schema';
import { NestedEnumGenderFilterObjectSchema as NestedEnumGenderFilterObjectSchema } from './NestedEnumGenderFilter.schema'

const makeSchema = () => z.object({
  equals: GenderSchema.optional(),
  in: GenderSchema.array().optional(),
  notIn: GenderSchema.array().optional(),
  not: z.union([GenderSchema, z.lazy(() => NestedEnumGenderFilterObjectSchema)]).optional()
}).strict();
export const EnumGenderFilterObjectSchema: z.ZodType<Prisma.EnumGenderFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumGenderFilter>;
export const EnumGenderFilterObjectZodSchema = makeSchema();
