import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string(),
  name: z.string()
}).strict();
export const MarketSegmentCreateWithoutWatchSpecInputObjectSchema: z.ZodType<Prisma.MarketSegmentCreateWithoutWatchSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentCreateWithoutWatchSpecInput>;
export const MarketSegmentCreateWithoutWatchSpecInputObjectZodSchema = makeSchema();
