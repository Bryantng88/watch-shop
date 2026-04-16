import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { GenderSchema } from '../enums/Gender.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumGenderFilterObjectSchema as NestedEnumGenderFilterObjectSchema } from './NestedEnumGenderFilter.schema'

const nestedenumgenderwithaggregatesfilterSchema = z.object({
  equals: GenderSchema.optional(),
  in: GenderSchema.array().optional(),
  notIn: GenderSchema.array().optional(),
  not: z.union([GenderSchema, z.lazy(() => NestedEnumGenderWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumGenderFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumGenderFilterObjectSchema).optional()
}).strict();
export const NestedEnumGenderWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumGenderWithAggregatesFilter> = nestedenumgenderwithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumGenderWithAggregatesFilter>;
export const NestedEnumGenderWithAggregatesFilterObjectZodSchema = nestedenumgenderwithaggregatesfilterSchema;
