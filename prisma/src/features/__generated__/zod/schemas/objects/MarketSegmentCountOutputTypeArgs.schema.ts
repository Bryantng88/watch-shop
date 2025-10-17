import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MarketSegmentCountOutputTypeSelectObjectSchema as MarketSegmentCountOutputTypeSelectObjectSchema } from './MarketSegmentCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => MarketSegmentCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const MarketSegmentCountOutputTypeArgsObjectSchema = makeSchema();
export const MarketSegmentCountOutputTypeArgsObjectZodSchema = makeSchema();
