import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchUpdateWithoutWatchSpecV2InputObjectSchema as WatchUpdateWithoutWatchSpecV2InputObjectSchema } from './WatchUpdateWithoutWatchSpecV2Input.schema';
import { WatchUncheckedUpdateWithoutWatchSpecV2InputObjectSchema as WatchUncheckedUpdateWithoutWatchSpecV2InputObjectSchema } from './WatchUncheckedUpdateWithoutWatchSpecV2Input.schema';
import { WatchCreateWithoutWatchSpecV2InputObjectSchema as WatchCreateWithoutWatchSpecV2InputObjectSchema } from './WatchCreateWithoutWatchSpecV2Input.schema';
import { WatchUncheckedCreateWithoutWatchSpecV2InputObjectSchema as WatchUncheckedCreateWithoutWatchSpecV2InputObjectSchema } from './WatchUncheckedCreateWithoutWatchSpecV2Input.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WatchUpdateWithoutWatchSpecV2InputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutWatchSpecV2InputObjectSchema)]),
  create: z.union([z.lazy(() => WatchCreateWithoutWatchSpecV2InputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWatchSpecV2InputObjectSchema)]),
  where: z.lazy(() => WatchWhereInputObjectSchema).optional()
}).strict();
export const WatchUpsertWithoutWatchSpecV2InputObjectSchema: z.ZodType<Prisma.WatchUpsertWithoutWatchSpecV2Input> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpsertWithoutWatchSpecV2Input>;
export const WatchUpsertWithoutWatchSpecV2InputObjectZodSchema = makeSchema();
