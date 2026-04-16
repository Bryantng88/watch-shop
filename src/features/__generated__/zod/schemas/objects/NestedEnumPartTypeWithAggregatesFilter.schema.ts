import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PartTypeSchema } from '../enums/PartType.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumPartTypeFilterObjectSchema as NestedEnumPartTypeFilterObjectSchema } from './NestedEnumPartTypeFilter.schema'

const nestedenumparttypewithaggregatesfilterSchema = z.object({
  equals: PartTypeSchema.optional(),
  in: PartTypeSchema.array().optional(),
  notIn: PartTypeSchema.array().optional(),
  not: z.union([PartTypeSchema, z.lazy(() => NestedEnumPartTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumPartTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumPartTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumPartTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumPartTypeWithAggregatesFilter> = nestedenumparttypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumPartTypeWithAggregatesFilter>;
export const NestedEnumPartTypeWithAggregatesFilterObjectZodSchema = nestedenumparttypewithaggregatesfilterSchema;
