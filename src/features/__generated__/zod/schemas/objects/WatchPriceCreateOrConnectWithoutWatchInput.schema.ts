import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchPriceWhereUniqueInputObjectSchema as WatchPriceWhereUniqueInputObjectSchema } from './WatchPriceWhereUniqueInput.schema';
import { WatchPriceCreateWithoutWatchInputObjectSchema as WatchPriceCreateWithoutWatchInputObjectSchema } from './WatchPriceCreateWithoutWatchInput.schema';
import { WatchPriceUncheckedCreateWithoutWatchInputObjectSchema as WatchPriceUncheckedCreateWithoutWatchInputObjectSchema } from './WatchPriceUncheckedCreateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchPriceWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchPriceCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchPriceUncheckedCreateWithoutWatchInputObjectSchema)])
}).strict();
export const WatchPriceCreateOrConnectWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchPriceCreateOrConnectWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchPriceCreateOrConnectWithoutWatchInput>;
export const WatchPriceCreateOrConnectWithoutWatchInputObjectZodSchema = makeSchema();
