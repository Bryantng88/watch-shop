import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchUpdateWithoutWatchContentInputObjectSchema as WatchUpdateWithoutWatchContentInputObjectSchema } from './WatchUpdateWithoutWatchContentInput.schema';
import { WatchUncheckedUpdateWithoutWatchContentInputObjectSchema as WatchUncheckedUpdateWithoutWatchContentInputObjectSchema } from './WatchUncheckedUpdateWithoutWatchContentInput.schema';
import { WatchCreateWithoutWatchContentInputObjectSchema as WatchCreateWithoutWatchContentInputObjectSchema } from './WatchCreateWithoutWatchContentInput.schema';
import { WatchUncheckedCreateWithoutWatchContentInputObjectSchema as WatchUncheckedCreateWithoutWatchContentInputObjectSchema } from './WatchUncheckedCreateWithoutWatchContentInput.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WatchUpdateWithoutWatchContentInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutWatchContentInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchCreateWithoutWatchContentInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWatchContentInputObjectSchema)]),
  where: z.lazy(() => WatchWhereInputObjectSchema).optional()
}).strict();
export const WatchUpsertWithoutWatchContentInputObjectSchema: z.ZodType<Prisma.WatchUpsertWithoutWatchContentInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpsertWithoutWatchContentInput>;
export const WatchUpsertWithoutWatchContentInputObjectZodSchema = makeSchema();
