import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapClaspTypeSchema } from '../enums/StrapClaspType.schema';
import { NestedEnumStrapClaspTypeWithAggregatesFilterObjectSchema as NestedEnumStrapClaspTypeWithAggregatesFilterObjectSchema } from './NestedEnumStrapClaspTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumStrapClaspTypeFilterObjectSchema as NestedEnumStrapClaspTypeFilterObjectSchema } from './NestedEnumStrapClaspTypeFilter.schema'

const makeSchema = () => z.object({
  equals: StrapClaspTypeSchema.optional(),
  in: StrapClaspTypeSchema.array().optional(),
  notIn: StrapClaspTypeSchema.array().optional(),
  not: z.union([StrapClaspTypeSchema, z.lazy(() => NestedEnumStrapClaspTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStrapClaspTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStrapClaspTypeFilterObjectSchema).optional()
}).strict();
export const EnumStrapClaspTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumStrapClaspTypeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStrapClaspTypeWithAggregatesFilter>;
export const EnumStrapClaspTypeWithAggregatesFilterObjectZodSchema = makeSchema();
