import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutWatchPriceInputObjectSchema as WatchCreateWithoutWatchPriceInputObjectSchema } from './WatchCreateWithoutWatchPriceInput.schema';
import { WatchUncheckedCreateWithoutWatchPriceInputObjectSchema as WatchUncheckedCreateWithoutWatchPriceInputObjectSchema } from './WatchUncheckedCreateWithoutWatchPriceInput.schema';
import { WatchCreateOrConnectWithoutWatchPriceInputObjectSchema as WatchCreateOrConnectWithoutWatchPriceInputObjectSchema } from './WatchCreateOrConnectWithoutWatchPriceInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutWatchPriceInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWatchPriceInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutWatchPriceInputObjectSchema).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional()
}).strict();
export const WatchCreateNestedOneWithoutWatchPriceInputObjectSchema: z.ZodType<Prisma.WatchCreateNestedOneWithoutWatchPriceInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateNestedOneWithoutWatchPriceInput>;
export const WatchCreateNestedOneWithoutWatchPriceInputObjectZodSchema = makeSchema();
