import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchContentUpdateWithoutWatchInputObjectSchema as WatchContentUpdateWithoutWatchInputObjectSchema } from './WatchContentUpdateWithoutWatchInput.schema';
import { WatchContentUncheckedUpdateWithoutWatchInputObjectSchema as WatchContentUncheckedUpdateWithoutWatchInputObjectSchema } from './WatchContentUncheckedUpdateWithoutWatchInput.schema';
import { WatchContentCreateWithoutWatchInputObjectSchema as WatchContentCreateWithoutWatchInputObjectSchema } from './WatchContentCreateWithoutWatchInput.schema';
import { WatchContentUncheckedCreateWithoutWatchInputObjectSchema as WatchContentUncheckedCreateWithoutWatchInputObjectSchema } from './WatchContentUncheckedCreateWithoutWatchInput.schema';
import { WatchContentWhereInputObjectSchema as WatchContentWhereInputObjectSchema } from './WatchContentWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WatchContentUpdateWithoutWatchInputObjectSchema), z.lazy(() => WatchContentUncheckedUpdateWithoutWatchInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchContentCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchContentUncheckedCreateWithoutWatchInputObjectSchema)]),
  where: z.lazy(() => WatchContentWhereInputObjectSchema).optional()
}).strict();
export const WatchContentUpsertWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchContentUpsertWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchContentUpsertWithoutWatchInput>;
export const WatchContentUpsertWithoutWatchInputObjectZodSchema = makeSchema();
