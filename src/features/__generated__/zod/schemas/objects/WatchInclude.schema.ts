import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { WatchContentArgsObjectSchema as WatchContentArgsObjectSchema } from './WatchContentArgs.schema';
import { WatchPriceArgsObjectSchema as WatchPriceArgsObjectSchema } from './WatchPriceArgs.schema';
import { WatchSpecV2ArgsObjectSchema as WatchSpecV2ArgsObjectSchema } from './WatchSpecV2Args.schema'

const makeSchema = () => z.object({
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  watchContent: z.union([z.boolean(), z.lazy(() => WatchContentArgsObjectSchema)]).optional(),
  watchPrice: z.union([z.boolean(), z.lazy(() => WatchPriceArgsObjectSchema)]).optional(),
  watchSpecV2: z.union([z.boolean(), z.lazy(() => WatchSpecV2ArgsObjectSchema)]).optional()
}).strict();
export const WatchIncludeObjectSchema: z.ZodType<Prisma.WatchInclude> = makeSchema() as unknown as z.ZodType<Prisma.WatchInclude>;
export const WatchIncludeObjectZodSchema = makeSchema();
