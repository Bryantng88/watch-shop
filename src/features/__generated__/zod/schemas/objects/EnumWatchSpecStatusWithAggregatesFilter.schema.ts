import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecStatusSchema } from '../enums/WatchSpecStatus.schema';
import { NestedEnumWatchSpecStatusWithAggregatesFilterObjectSchema as NestedEnumWatchSpecStatusWithAggregatesFilterObjectSchema } from './NestedEnumWatchSpecStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWatchSpecStatusFilterObjectSchema as NestedEnumWatchSpecStatusFilterObjectSchema } from './NestedEnumWatchSpecStatusFilter.schema'

const makeSchema = () => z.object({
  equals: WatchSpecStatusSchema.optional(),
  in: WatchSpecStatusSchema.array().optional(),
  notIn: WatchSpecStatusSchema.array().optional(),
  not: z.union([WatchSpecStatusSchema, z.lazy(() => NestedEnumWatchSpecStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchSpecStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchSpecStatusFilterObjectSchema).optional()
}).strict();
export const EnumWatchSpecStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWatchSpecStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchSpecStatusWithAggregatesFilter>;
export const EnumWatchSpecStatusWithAggregatesFilterObjectZodSchema = makeSchema();
