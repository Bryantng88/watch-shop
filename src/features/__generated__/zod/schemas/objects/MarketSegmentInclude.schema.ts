import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecFindManySchema as WatchSpecFindManySchema } from '../findManyWatchSpec.schema';
import { MarketSegmentCountOutputTypeArgsObjectSchema as MarketSegmentCountOutputTypeArgsObjectSchema } from './MarketSegmentCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  watchSpecs: z.union([z.boolean(), z.lazy(() => WatchSpecFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => MarketSegmentCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const MarketSegmentIncludeObjectSchema: z.ZodType<Prisma.MarketSegmentInclude> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentInclude>;
export const MarketSegmentIncludeObjectZodSchema = makeSchema();
