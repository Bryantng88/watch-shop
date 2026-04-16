import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchUpdateWithoutWatchPriceInputObjectSchema as WatchUpdateWithoutWatchPriceInputObjectSchema } from './WatchUpdateWithoutWatchPriceInput.schema';
import { WatchUncheckedUpdateWithoutWatchPriceInputObjectSchema as WatchUncheckedUpdateWithoutWatchPriceInputObjectSchema } from './WatchUncheckedUpdateWithoutWatchPriceInput.schema';
import { WatchCreateWithoutWatchPriceInputObjectSchema as WatchCreateWithoutWatchPriceInputObjectSchema } from './WatchCreateWithoutWatchPriceInput.schema';
import { WatchUncheckedCreateWithoutWatchPriceInputObjectSchema as WatchUncheckedCreateWithoutWatchPriceInputObjectSchema } from './WatchUncheckedCreateWithoutWatchPriceInput.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WatchUpdateWithoutWatchPriceInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutWatchPriceInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchCreateWithoutWatchPriceInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWatchPriceInputObjectSchema)]),
  where: z.lazy(() => WatchWhereInputObjectSchema).optional()
}).strict();
export const WatchUpsertWithoutWatchPriceInputObjectSchema: z.ZodType<Prisma.WatchUpsertWithoutWatchPriceInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpsertWithoutWatchPriceInput>;
export const WatchUpsertWithoutWatchPriceInputObjectZodSchema = makeSchema();
