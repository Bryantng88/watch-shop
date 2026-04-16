import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchPriceSelectObjectSchema as WatchPriceSelectObjectSchema } from './WatchPriceSelect.schema';
import { WatchPriceIncludeObjectSchema as WatchPriceIncludeObjectSchema } from './WatchPriceInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WatchPriceSelectObjectSchema).optional(),
  include: z.lazy(() => WatchPriceIncludeObjectSchema).optional()
}).strict();
export const WatchPriceArgsObjectSchema = makeSchema();
export const WatchPriceArgsObjectZodSchema = makeSchema();
