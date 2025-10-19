import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { ComplicationFindManySchema as ComplicationFindManySchema } from '../findManyComplication.schema';
import { MarketSegmentFindManySchema as MarketSegmentFindManySchema } from '../findManyMarketSegment.schema';
import { WatchSpecCountOutputTypeArgsObjectSchema as WatchSpecCountOutputTypeArgsObjectSchema } from './WatchSpecCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  complication: z.union([z.boolean(), z.lazy(() => ComplicationFindManySchema)]).optional(),
  marketSegment: z.union([z.boolean(), z.lazy(() => MarketSegmentFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => WatchSpecCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const WatchSpecIncludeObjectSchema: z.ZodType<Prisma.WatchSpecInclude> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecInclude>;
export const WatchSpecIncludeObjectZodSchema = makeSchema();
