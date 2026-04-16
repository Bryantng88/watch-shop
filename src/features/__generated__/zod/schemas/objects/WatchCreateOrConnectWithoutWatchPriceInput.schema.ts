import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchCreateWithoutWatchPriceInputObjectSchema as WatchCreateWithoutWatchPriceInputObjectSchema } from './WatchCreateWithoutWatchPriceInput.schema';
import { WatchUncheckedCreateWithoutWatchPriceInputObjectSchema as WatchUncheckedCreateWithoutWatchPriceInputObjectSchema } from './WatchUncheckedCreateWithoutWatchPriceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchCreateWithoutWatchPriceInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWatchPriceInputObjectSchema)])
}).strict();
export const WatchCreateOrConnectWithoutWatchPriceInputObjectSchema: z.ZodType<Prisma.WatchCreateOrConnectWithoutWatchPriceInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateOrConnectWithoutWatchPriceInput>;
export const WatchCreateOrConnectWithoutWatchPriceInputObjectZodSchema = makeSchema();
