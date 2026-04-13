import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { orderflowtypeSchema } from '../enums/orderflowtype.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumorderflowtypeFilterObjectSchema as NestedEnumorderflowtypeFilterObjectSchema } from './NestedEnumorderflowtypeFilter.schema'

const nestedenumorderflowtypewithaggregatesfilterSchema = z.object({
  equals: orderflowtypeSchema.optional(),
  in: orderflowtypeSchema.array().optional(),
  notIn: orderflowtypeSchema.array().optional(),
  not: z.union([orderflowtypeSchema, z.lazy(() => NestedEnumorderflowtypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumorderflowtypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumorderflowtypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumorderflowtypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumorderflowtypeWithAggregatesFilter> = nestedenumorderflowtypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumorderflowtypeWithAggregatesFilter>;
export const NestedEnumorderflowtypeWithAggregatesFilterObjectZodSchema = nestedenumorderflowtypewithaggregatesfilterSchema;
