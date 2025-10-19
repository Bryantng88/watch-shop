import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TagSchema } from '../enums/Tag.schema';
import { NestedEnumTagWithAggregatesFilterObjectSchema as NestedEnumTagWithAggregatesFilterObjectSchema } from './NestedEnumTagWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTagFilterObjectSchema as NestedEnumTagFilterObjectSchema } from './NestedEnumTagFilter.schema'

const makeSchema = () => z.object({
  equals: TagSchema.optional(),
  in: TagSchema.array().optional(),
  notIn: TagSchema.array().optional(),
  not: z.union([TagSchema, z.lazy(() => NestedEnumTagWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTagFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTagFilterObjectSchema).optional()
}).strict();
export const EnumTagWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumTagWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTagWithAggregatesFilter>;
export const EnumTagWithAggregatesFilterObjectZodSchema = makeSchema();
