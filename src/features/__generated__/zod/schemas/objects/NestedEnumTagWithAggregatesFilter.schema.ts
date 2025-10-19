import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TagSchema } from '../enums/Tag.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTagFilterObjectSchema as NestedEnumTagFilterObjectSchema } from './NestedEnumTagFilter.schema'

const nestedenumtagwithaggregatesfilterSchema = z.object({
  equals: TagSchema.optional(),
  in: TagSchema.array().optional(),
  notIn: TagSchema.array().optional(),
  not: z.union([TagSchema, z.lazy(() => NestedEnumTagWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTagFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTagFilterObjectSchema).optional()
}).strict();
export const NestedEnumTagWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumTagWithAggregatesFilter> = nestedenumtagwithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTagWithAggregatesFilter>;
export const NestedEnumTagWithAggregatesFilterObjectZodSchema = nestedenumtagwithaggregatesfilterSchema;
