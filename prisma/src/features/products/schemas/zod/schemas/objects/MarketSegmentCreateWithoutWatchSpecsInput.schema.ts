import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const MarketSegmentCreateWithoutWatchSpecsInputObjectSchema: z.ZodType<Prisma.MarketSegmentCreateWithoutWatchSpecsInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentCreateWithoutWatchSpecsInput>;
export const MarketSegmentCreateWithoutWatchSpecsInputObjectZodSchema = makeSchema();
