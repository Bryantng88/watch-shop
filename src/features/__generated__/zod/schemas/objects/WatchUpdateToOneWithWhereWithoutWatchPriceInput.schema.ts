import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema';
import { WatchUpdateWithoutWatchPriceInputObjectSchema as WatchUpdateWithoutWatchPriceInputObjectSchema } from './WatchUpdateWithoutWatchPriceInput.schema';
import { WatchUncheckedUpdateWithoutWatchPriceInputObjectSchema as WatchUncheckedUpdateWithoutWatchPriceInputObjectSchema } from './WatchUncheckedUpdateWithoutWatchPriceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WatchUpdateWithoutWatchPriceInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutWatchPriceInputObjectSchema)])
}).strict();
export const WatchUpdateToOneWithWhereWithoutWatchPriceInputObjectSchema: z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutWatchPriceInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutWatchPriceInput>;
export const WatchUpdateToOneWithWhereWithoutWatchPriceInputObjectZodSchema = makeSchema();
