import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MarketSegmentSelectObjectSchema as MarketSegmentSelectObjectSchema } from './MarketSegmentSelect.schema';
import { MarketSegmentIncludeObjectSchema as MarketSegmentIncludeObjectSchema } from './MarketSegmentInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => MarketSegmentSelectObjectSchema).optional(),
  include: z.lazy(() => MarketSegmentIncludeObjectSchema).optional()
}).strict();
export const MarketSegmentArgsObjectSchema = makeSchema();
export const MarketSegmentArgsObjectZodSchema = makeSchema();
