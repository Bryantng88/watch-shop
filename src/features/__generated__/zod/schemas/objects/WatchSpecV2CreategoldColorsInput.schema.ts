import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchGoldColorV2Schema } from '../enums/WatchGoldColorV2.schema'

const makeSchema = () => z.object({
  set: WatchGoldColorV2Schema.array()
}).strict();
export const WatchSpecV2CreategoldColorsInputObjectSchema: z.ZodType<Prisma.WatchSpecV2CreategoldColorsInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecV2CreategoldColorsInput>;
export const WatchSpecV2CreategoldColorsInputObjectZodSchema = makeSchema();
