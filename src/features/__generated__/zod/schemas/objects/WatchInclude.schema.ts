import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { WatchContentArgsObjectSchema as WatchContentArgsObjectSchema } from './WatchContentArgs.schema';
import { WatchMediaFindManySchema as WatchMediaFindManySchema } from '../findManyWatchMedia.schema';
import { WatchPriceArgsObjectSchema as WatchPriceArgsObjectSchema } from './WatchPriceArgs.schema';
import { WatchSpecV2ArgsObjectSchema as WatchSpecV2ArgsObjectSchema } from './WatchSpecV2Args.schema';
import { WatchCountOutputTypeArgsObjectSchema as WatchCountOutputTypeArgsObjectSchema } from './WatchCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  watchContent: z.union([z.boolean(), z.lazy(() => WatchContentArgsObjectSchema)]).optional(),
  watchMedia: z.union([z.boolean(), z.lazy(() => WatchMediaFindManySchema)]).optional(),
  watchPrice: z.union([z.boolean(), z.lazy(() => WatchPriceArgsObjectSchema)]).optional(),
  watchSpecV2: z.union([z.boolean(), z.lazy(() => WatchSpecV2ArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => WatchCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const WatchIncludeObjectSchema: z.ZodType<Prisma.WatchInclude> = makeSchema() as unknown as z.ZodType<Prisma.WatchInclude>;
export const WatchIncludeObjectZodSchema = makeSchema();
