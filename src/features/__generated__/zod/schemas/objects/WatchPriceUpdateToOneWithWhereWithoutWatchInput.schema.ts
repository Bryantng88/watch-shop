import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchPriceWhereInputObjectSchema as WatchPriceWhereInputObjectSchema } from './WatchPriceWhereInput.schema';
import { WatchPriceUpdateWithoutWatchInputObjectSchema as WatchPriceUpdateWithoutWatchInputObjectSchema } from './WatchPriceUpdateWithoutWatchInput.schema';
import { WatchPriceUncheckedUpdateWithoutWatchInputObjectSchema as WatchPriceUncheckedUpdateWithoutWatchInputObjectSchema } from './WatchPriceUncheckedUpdateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchPriceWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WatchPriceUpdateWithoutWatchInputObjectSchema), z.lazy(() => WatchPriceUncheckedUpdateWithoutWatchInputObjectSchema)])
}).strict();
export const WatchPriceUpdateToOneWithWhereWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchPriceUpdateToOneWithWhereWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchPriceUpdateToOneWithWhereWithoutWatchInput>;
export const WatchPriceUpdateToOneWithWhereWithoutWatchInputObjectZodSchema = makeSchema();
