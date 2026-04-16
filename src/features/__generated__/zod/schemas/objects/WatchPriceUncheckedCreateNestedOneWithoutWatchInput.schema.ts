import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchPriceCreateWithoutWatchInputObjectSchema as WatchPriceCreateWithoutWatchInputObjectSchema } from './WatchPriceCreateWithoutWatchInput.schema';
import { WatchPriceUncheckedCreateWithoutWatchInputObjectSchema as WatchPriceUncheckedCreateWithoutWatchInputObjectSchema } from './WatchPriceUncheckedCreateWithoutWatchInput.schema';
import { WatchPriceCreateOrConnectWithoutWatchInputObjectSchema as WatchPriceCreateOrConnectWithoutWatchInputObjectSchema } from './WatchPriceCreateOrConnectWithoutWatchInput.schema';
import { WatchPriceWhereUniqueInputObjectSchema as WatchPriceWhereUniqueInputObjectSchema } from './WatchPriceWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchPriceCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchPriceUncheckedCreateWithoutWatchInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchPriceCreateOrConnectWithoutWatchInputObjectSchema).optional(),
  connect: z.lazy(() => WatchPriceWhereUniqueInputObjectSchema).optional()
}).strict();
export const WatchPriceUncheckedCreateNestedOneWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchPriceUncheckedCreateNestedOneWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchPriceUncheckedCreateNestedOneWithoutWatchInput>;
export const WatchPriceUncheckedCreateNestedOneWithoutWatchInputObjectZodSchema = makeSchema();
