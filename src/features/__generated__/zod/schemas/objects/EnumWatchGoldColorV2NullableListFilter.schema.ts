import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchGoldColorV2Schema } from '../enums/WatchGoldColorV2.schema'

const makeSchema = () => z.object({
  equals: WatchGoldColorV2Schema.array().optional().nullable(),
  has: WatchGoldColorV2Schema.optional().nullable(),
  hasEvery: WatchGoldColorV2Schema.array().optional(),
  hasSome: WatchGoldColorV2Schema.array().optional(),
  isEmpty: z.boolean().optional()
}).strict();
export const EnumWatchGoldColorV2NullableListFilterObjectSchema: z.ZodType<Prisma.EnumWatchGoldColorV2NullableListFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchGoldColorV2NullableListFilter>;
export const EnumWatchGoldColorV2NullableListFilterObjectZodSchema = makeSchema();
