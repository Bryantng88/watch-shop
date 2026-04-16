import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchUpdateWithoutWatchMediaInputObjectSchema as WatchUpdateWithoutWatchMediaInputObjectSchema } from './WatchUpdateWithoutWatchMediaInput.schema';
import { WatchUncheckedUpdateWithoutWatchMediaInputObjectSchema as WatchUncheckedUpdateWithoutWatchMediaInputObjectSchema } from './WatchUncheckedUpdateWithoutWatchMediaInput.schema';
import { WatchCreateWithoutWatchMediaInputObjectSchema as WatchCreateWithoutWatchMediaInputObjectSchema } from './WatchCreateWithoutWatchMediaInput.schema';
import { WatchUncheckedCreateWithoutWatchMediaInputObjectSchema as WatchUncheckedCreateWithoutWatchMediaInputObjectSchema } from './WatchUncheckedCreateWithoutWatchMediaInput.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WatchUpdateWithoutWatchMediaInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutWatchMediaInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchCreateWithoutWatchMediaInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWatchMediaInputObjectSchema)]),
  where: z.lazy(() => WatchWhereInputObjectSchema).optional()
}).strict();
export const WatchUpsertWithoutWatchMediaInputObjectSchema: z.ZodType<Prisma.WatchUpsertWithoutWatchMediaInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpsertWithoutWatchMediaInput>;
export const WatchUpsertWithoutWatchMediaInputObjectZodSchema = makeSchema();
