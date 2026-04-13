import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { orderflowtypeSchema } from '../enums/orderflowtype.schema';
import { NestedEnumorderflowtypeWithAggregatesFilterObjectSchema as NestedEnumorderflowtypeWithAggregatesFilterObjectSchema } from './NestedEnumorderflowtypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumorderflowtypeFilterObjectSchema as NestedEnumorderflowtypeFilterObjectSchema } from './NestedEnumorderflowtypeFilter.schema'

const makeSchema = () => z.object({
  equals: orderflowtypeSchema.optional(),
  in: orderflowtypeSchema.array().optional(),
  notIn: orderflowtypeSchema.array().optional(),
  not: z.union([orderflowtypeSchema, z.lazy(() => NestedEnumorderflowtypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumorderflowtypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumorderflowtypeFilterObjectSchema).optional()
}).strict();
export const EnumorderflowtypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumorderflowtypeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumorderflowtypeWithAggregatesFilter>;
export const EnumorderflowtypeWithAggregatesFilterObjectZodSchema = makeSchema();
