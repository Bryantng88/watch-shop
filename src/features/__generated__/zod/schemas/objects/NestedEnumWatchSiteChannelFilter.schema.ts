import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSiteChannelSchema } from '../enums/WatchSiteChannel.schema'

const nestedenumwatchsitechannelfilterSchema = z.object({
  equals: WatchSiteChannelSchema.optional(),
  in: WatchSiteChannelSchema.array().optional(),
  notIn: WatchSiteChannelSchema.array().optional(),
  not: z.union([WatchSiteChannelSchema, z.lazy(() => NestedEnumWatchSiteChannelFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumWatchSiteChannelFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchSiteChannelFilter> = nestedenumwatchsitechannelfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchSiteChannelFilter>;
export const NestedEnumWatchSiteChannelFilterObjectZodSchema = nestedenumwatchsitechannelfilterSchema;
