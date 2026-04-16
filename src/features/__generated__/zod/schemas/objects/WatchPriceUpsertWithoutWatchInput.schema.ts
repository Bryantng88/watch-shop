import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchPriceUpdateWithoutWatchInputObjectSchema as WatchPriceUpdateWithoutWatchInputObjectSchema } from './WatchPriceUpdateWithoutWatchInput.schema';
import { WatchPriceUncheckedUpdateWithoutWatchInputObjectSchema as WatchPriceUncheckedUpdateWithoutWatchInputObjectSchema } from './WatchPriceUncheckedUpdateWithoutWatchInput.schema';
import { WatchPriceCreateWithoutWatchInputObjectSchema as WatchPriceCreateWithoutWatchInputObjectSchema } from './WatchPriceCreateWithoutWatchInput.schema';
import { WatchPriceUncheckedCreateWithoutWatchInputObjectSchema as WatchPriceUncheckedCreateWithoutWatchInputObjectSchema } from './WatchPriceUncheckedCreateWithoutWatchInput.schema';
import { WatchPriceWhereInputObjectSchema as WatchPriceWhereInputObjectSchema } from './WatchPriceWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WatchPriceUpdateWithoutWatchInputObjectSchema), z.lazy(() => WatchPriceUncheckedUpdateWithoutWatchInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchPriceCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchPriceUncheckedCreateWithoutWatchInputObjectSchema)]),
  where: z.lazy(() => WatchPriceWhereInputObjectSchema).optional()
}).strict();
export const WatchPriceUpsertWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchPriceUpsertWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchPriceUpsertWithoutWatchInput>;
export const WatchPriceUpsertWithoutWatchInputObjectZodSchema = makeSchema();
