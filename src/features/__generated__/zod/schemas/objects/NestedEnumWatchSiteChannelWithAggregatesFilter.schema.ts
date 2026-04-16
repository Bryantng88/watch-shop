import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSiteChannelSchema } from '../enums/WatchSiteChannel.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWatchSiteChannelFilterObjectSchema as NestedEnumWatchSiteChannelFilterObjectSchema } from './NestedEnumWatchSiteChannelFilter.schema'

const nestedenumwatchsitechannelwithaggregatesfilterSchema = z.object({
  equals: WatchSiteChannelSchema.optional(),
  in: WatchSiteChannelSchema.array().optional(),
  notIn: WatchSiteChannelSchema.array().optional(),
  not: z.union([WatchSiteChannelSchema, z.lazy(() => NestedEnumWatchSiteChannelWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchSiteChannelFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchSiteChannelFilterObjectSchema).optional()
}).strict();
export const NestedEnumWatchSiteChannelWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchSiteChannelWithAggregatesFilter> = nestedenumwatchsitechannelwithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchSiteChannelWithAggregatesFilter>;
export const NestedEnumWatchSiteChannelWithAggregatesFilterObjectZodSchema = nestedenumwatchsitechannelwithaggregatesfilterSchema;
