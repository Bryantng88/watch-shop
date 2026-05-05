import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapComponentSourceSchema } from '../enums/WatchStrapComponentSource.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumWatchStrapComponentSourceNullableFilterObjectSchema as NestedEnumWatchStrapComponentSourceNullableFilterObjectSchema } from './NestedEnumWatchStrapComponentSourceNullableFilter.schema'

const nestedenumwatchstrapcomponentsourcenullablewithaggregatesfilterSchema = z.object({
  equals: WatchStrapComponentSourceSchema.optional().nullable(),
  in: WatchStrapComponentSourceSchema.array().optional().nullable(),
  notIn: WatchStrapComponentSourceSchema.array().optional().nullable(),
  not: z.union([WatchStrapComponentSourceSchema, z.lazy(() => NestedEnumWatchStrapComponentSourceNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchStrapComponentSourceNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchStrapComponentSourceNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumWatchStrapComponentSourceNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchStrapComponentSourceNullableWithAggregatesFilter> = nestedenumwatchstrapcomponentsourcenullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchStrapComponentSourceNullableWithAggregatesFilter>;
export const NestedEnumWatchStrapComponentSourceNullableWithAggregatesFilterObjectZodSchema = nestedenumwatchstrapcomponentsourcenullablewithaggregatesfilterSchema;
