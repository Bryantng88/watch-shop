import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchGoldColorV2Schema } from '../enums/WatchGoldColorV2.schema'

const makeSchema = () => z.object({
  set: WatchGoldColorV2Schema.array().optional(),
  push: z.union([WatchGoldColorV2Schema, WatchGoldColorV2Schema.array()]).optional()
}).strict();
export const WatchSpecV2UpdategoldColorsInputObjectSchema: z.ZodType<Prisma.WatchSpecV2UpdategoldColorsInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecV2UpdategoldColorsInput>;
export const WatchSpecV2UpdategoldColorsInputObjectZodSchema = makeSchema();
