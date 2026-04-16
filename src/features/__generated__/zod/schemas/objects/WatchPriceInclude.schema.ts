import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchArgsObjectSchema as WatchArgsObjectSchema } from './WatchArgs.schema'

const makeSchema = () => z.object({
  watch: z.union([z.boolean(), z.lazy(() => WatchArgsObjectSchema)]).optional()
}).strict();
export const WatchPriceIncludeObjectSchema: z.ZodType<Prisma.WatchPriceInclude> = makeSchema() as unknown as z.ZodType<Prisma.WatchPriceInclude>;
export const WatchPriceIncludeObjectZodSchema = makeSchema();
