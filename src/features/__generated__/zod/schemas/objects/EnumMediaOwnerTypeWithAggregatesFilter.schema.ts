import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOwnerTypeSchema } from '../enums/MediaOwnerType.schema';
import { NestedEnumMediaOwnerTypeWithAggregatesFilterObjectSchema as NestedEnumMediaOwnerTypeWithAggregatesFilterObjectSchema } from './NestedEnumMediaOwnerTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMediaOwnerTypeFilterObjectSchema as NestedEnumMediaOwnerTypeFilterObjectSchema } from './NestedEnumMediaOwnerTypeFilter.schema'

const makeSchema = () => z.object({
  equals: MediaOwnerTypeSchema.optional(),
  in: MediaOwnerTypeSchema.array().optional(),
  notIn: MediaOwnerTypeSchema.array().optional(),
  not: z.union([MediaOwnerTypeSchema, z.lazy(() => NestedEnumMediaOwnerTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMediaOwnerTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMediaOwnerTypeFilterObjectSchema).optional()
}).strict();
export const EnumMediaOwnerTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumMediaOwnerTypeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaOwnerTypeWithAggregatesFilter>;
export const EnumMediaOwnerTypeWithAggregatesFilterObjectZodSchema = makeSchema();
