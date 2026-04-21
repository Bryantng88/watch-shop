import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const MarketSegmentUncheckedCreateWithoutWatchSpecInputObjectSchema: z.ZodType<Prisma.MarketSegmentUncheckedCreateWithoutWatchSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentUncheckedCreateWithoutWatchSpecInput>;
export const MarketSegmentUncheckedCreateWithoutWatchSpecInputObjectZodSchema = makeSchema();
