import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  watchSpecs: z.boolean().optional()
}).strict();
export const MarketSegmentCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.MarketSegmentCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentCountOutputTypeSelect>;
export const MarketSegmentCountOutputTypeSelectObjectZodSchema = makeSchema();
