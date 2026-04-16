import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSiteChannelSchema } from '../enums/WatchSiteChannel.schema'

const makeSchema = () => z.object({
  set: WatchSiteChannelSchema.optional()
}).strict();
export const EnumWatchSiteChannelFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumWatchSiteChannelFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchSiteChannelFieldUpdateOperationsInput>;
export const EnumWatchSiteChannelFieldUpdateOperationsInputObjectZodSchema = makeSchema();
