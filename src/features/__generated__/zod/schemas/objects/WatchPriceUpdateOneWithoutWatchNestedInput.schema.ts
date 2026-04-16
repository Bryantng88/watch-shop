import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchPriceCreateWithoutWatchInputObjectSchema as WatchPriceCreateWithoutWatchInputObjectSchema } from './WatchPriceCreateWithoutWatchInput.schema';
import { WatchPriceUncheckedCreateWithoutWatchInputObjectSchema as WatchPriceUncheckedCreateWithoutWatchInputObjectSchema } from './WatchPriceUncheckedCreateWithoutWatchInput.schema';
import { WatchPriceCreateOrConnectWithoutWatchInputObjectSchema as WatchPriceCreateOrConnectWithoutWatchInputObjectSchema } from './WatchPriceCreateOrConnectWithoutWatchInput.schema';
import { WatchPriceUpsertWithoutWatchInputObjectSchema as WatchPriceUpsertWithoutWatchInputObjectSchema } from './WatchPriceUpsertWithoutWatchInput.schema';
import { WatchPriceWhereInputObjectSchema as WatchPriceWhereInputObjectSchema } from './WatchPriceWhereInput.schema';
import { WatchPriceWhereUniqueInputObjectSchema as WatchPriceWhereUniqueInputObjectSchema } from './WatchPriceWhereUniqueInput.schema';
import { WatchPriceUpdateToOneWithWhereWithoutWatchInputObjectSchema as WatchPriceUpdateToOneWithWhereWithoutWatchInputObjectSchema } from './WatchPriceUpdateToOneWithWhereWithoutWatchInput.schema';
import { WatchPriceUpdateWithoutWatchInputObjectSchema as WatchPriceUpdateWithoutWatchInputObjectSchema } from './WatchPriceUpdateWithoutWatchInput.schema';
import { WatchPriceUncheckedUpdateWithoutWatchInputObjectSchema as WatchPriceUncheckedUpdateWithoutWatchInputObjectSchema } from './WatchPriceUncheckedUpdateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchPriceCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchPriceUncheckedCreateWithoutWatchInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchPriceCreateOrConnectWithoutWatchInputObjectSchema).optional(),
  upsert: z.lazy(() => WatchPriceUpsertWithoutWatchInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => WatchPriceWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => WatchPriceWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => WatchPriceWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WatchPriceUpdateToOneWithWhereWithoutWatchInputObjectSchema), z.lazy(() => WatchPriceUpdateWithoutWatchInputObjectSchema), z.lazy(() => WatchPriceUncheckedUpdateWithoutWatchInputObjectSchema)]).optional()
}).strict();
export const WatchPriceUpdateOneWithoutWatchNestedInputObjectSchema: z.ZodType<Prisma.WatchPriceUpdateOneWithoutWatchNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchPriceUpdateOneWithoutWatchNestedInput>;
export const WatchPriceUpdateOneWithoutWatchNestedInputObjectZodSchema = makeSchema();
