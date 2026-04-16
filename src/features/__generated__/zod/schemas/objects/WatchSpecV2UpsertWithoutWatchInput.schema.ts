import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecV2UpdateWithoutWatchInputObjectSchema as WatchSpecV2UpdateWithoutWatchInputObjectSchema } from './WatchSpecV2UpdateWithoutWatchInput.schema';
import { WatchSpecV2UncheckedUpdateWithoutWatchInputObjectSchema as WatchSpecV2UncheckedUpdateWithoutWatchInputObjectSchema } from './WatchSpecV2UncheckedUpdateWithoutWatchInput.schema';
import { WatchSpecV2CreateWithoutWatchInputObjectSchema as WatchSpecV2CreateWithoutWatchInputObjectSchema } from './WatchSpecV2CreateWithoutWatchInput.schema';
import { WatchSpecV2UncheckedCreateWithoutWatchInputObjectSchema as WatchSpecV2UncheckedCreateWithoutWatchInputObjectSchema } from './WatchSpecV2UncheckedCreateWithoutWatchInput.schema';
import { WatchSpecV2WhereInputObjectSchema as WatchSpecV2WhereInputObjectSchema } from './WatchSpecV2WhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WatchSpecV2UpdateWithoutWatchInputObjectSchema), z.lazy(() => WatchSpecV2UncheckedUpdateWithoutWatchInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchSpecV2CreateWithoutWatchInputObjectSchema), z.lazy(() => WatchSpecV2UncheckedCreateWithoutWatchInputObjectSchema)]),
  where: z.lazy(() => WatchSpecV2WhereInputObjectSchema).optional()
}).strict();
export const WatchSpecV2UpsertWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchSpecV2UpsertWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecV2UpsertWithoutWatchInput>;
export const WatchSpecV2UpsertWithoutWatchInputObjectZodSchema = makeSchema();
