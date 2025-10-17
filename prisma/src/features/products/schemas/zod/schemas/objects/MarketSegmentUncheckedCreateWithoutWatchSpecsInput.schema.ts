import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const MarketSegmentUncheckedCreateWithoutWatchSpecsInputObjectSchema: z.ZodType<Prisma.MarketSegmentUncheckedCreateWithoutWatchSpecsInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentUncheckedCreateWithoutWatchSpecsInput>;
export const MarketSegmentUncheckedCreateWithoutWatchSpecsInputObjectZodSchema = makeSchema();
