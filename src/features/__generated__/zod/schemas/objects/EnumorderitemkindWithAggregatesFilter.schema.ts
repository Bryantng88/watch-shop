import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { orderitemkindSchema } from '../enums/orderitemkind.schema';
import { NestedEnumorderitemkindWithAggregatesFilterObjectSchema as NestedEnumorderitemkindWithAggregatesFilterObjectSchema } from './NestedEnumorderitemkindWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumorderitemkindFilterObjectSchema as NestedEnumorderitemkindFilterObjectSchema } from './NestedEnumorderitemkindFilter.schema'

const makeSchema = () => z.object({
  equals: orderitemkindSchema.optional(),
  in: orderitemkindSchema.array().optional(),
  notIn: orderitemkindSchema.array().optional(),
  not: z.union([orderitemkindSchema, z.lazy(() => NestedEnumorderitemkindWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumorderitemkindFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumorderitemkindFilterObjectSchema).optional()
}).strict();
export const EnumorderitemkindWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumorderitemkindWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumorderitemkindWithAggregatesFilter>;
export const EnumorderitemkindWithAggregatesFilterObjectZodSchema = makeSchema();
