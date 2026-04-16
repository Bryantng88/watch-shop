import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  watchId: z.string().optional()
}).strict();
export const WatchPriceWhereUniqueInputObjectSchema: z.ZodType<Prisma.WatchPriceWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchPriceWhereUniqueInput>;
export const WatchPriceWhereUniqueInputObjectZodSchema = makeSchema();
