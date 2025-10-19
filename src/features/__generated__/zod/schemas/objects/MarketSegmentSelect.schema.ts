import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecFindManySchema as WatchSpecFindManySchema } from '../findManyWatchSpec.schema';
import { MarketSegmentCountOutputTypeArgsObjectSchema as MarketSegmentCountOutputTypeArgsObjectSchema } from './MarketSegmentCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  watchSpecs: z.union([z.boolean(), z.lazy(() => WatchSpecFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => MarketSegmentCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const MarketSegmentSelectObjectSchema: z.ZodType<Prisma.MarketSegmentSelect> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentSelect>;
export const MarketSegmentSelectObjectZodSchema = makeSchema();
