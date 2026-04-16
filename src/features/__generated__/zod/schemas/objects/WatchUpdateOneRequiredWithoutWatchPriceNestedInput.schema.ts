import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutWatchPriceInputObjectSchema as WatchCreateWithoutWatchPriceInputObjectSchema } from './WatchCreateWithoutWatchPriceInput.schema';
import { WatchUncheckedCreateWithoutWatchPriceInputObjectSchema as WatchUncheckedCreateWithoutWatchPriceInputObjectSchema } from './WatchUncheckedCreateWithoutWatchPriceInput.schema';
import { WatchCreateOrConnectWithoutWatchPriceInputObjectSchema as WatchCreateOrConnectWithoutWatchPriceInputObjectSchema } from './WatchCreateOrConnectWithoutWatchPriceInput.schema';
import { WatchUpsertWithoutWatchPriceInputObjectSchema as WatchUpsertWithoutWatchPriceInputObjectSchema } from './WatchUpsertWithoutWatchPriceInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchUpdateToOneWithWhereWithoutWatchPriceInputObjectSchema as WatchUpdateToOneWithWhereWithoutWatchPriceInputObjectSchema } from './WatchUpdateToOneWithWhereWithoutWatchPriceInput.schema';
import { WatchUpdateWithoutWatchPriceInputObjectSchema as WatchUpdateWithoutWatchPriceInputObjectSchema } from './WatchUpdateWithoutWatchPriceInput.schema';
import { WatchUncheckedUpdateWithoutWatchPriceInputObjectSchema as WatchUncheckedUpdateWithoutWatchPriceInputObjectSchema } from './WatchUncheckedUpdateWithoutWatchPriceInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutWatchPriceInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWatchPriceInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutWatchPriceInputObjectSchema).optional(),
  upsert: z.lazy(() => WatchUpsertWithoutWatchPriceInputObjectSchema).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WatchUpdateToOneWithWhereWithoutWatchPriceInputObjectSchema), z.lazy(() => WatchUpdateWithoutWatchPriceInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutWatchPriceInputObjectSchema)]).optional()
}).strict();
export const WatchUpdateOneRequiredWithoutWatchPriceNestedInputObjectSchema: z.ZodType<Prisma.WatchUpdateOneRequiredWithoutWatchPriceNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateOneRequiredWithoutWatchPriceNestedInput>;
export const WatchUpdateOneRequiredWithoutWatchPriceNestedInputObjectZodSchema = makeSchema();
