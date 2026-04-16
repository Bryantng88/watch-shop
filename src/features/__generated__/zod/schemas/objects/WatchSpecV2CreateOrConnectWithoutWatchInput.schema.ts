import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecV2WhereUniqueInputObjectSchema as WatchSpecV2WhereUniqueInputObjectSchema } from './WatchSpecV2WhereUniqueInput.schema';
import { WatchSpecV2CreateWithoutWatchInputObjectSchema as WatchSpecV2CreateWithoutWatchInputObjectSchema } from './WatchSpecV2CreateWithoutWatchInput.schema';
import { WatchSpecV2UncheckedCreateWithoutWatchInputObjectSchema as WatchSpecV2UncheckedCreateWithoutWatchInputObjectSchema } from './WatchSpecV2UncheckedCreateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchSpecV2WhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchSpecV2CreateWithoutWatchInputObjectSchema), z.lazy(() => WatchSpecV2UncheckedCreateWithoutWatchInputObjectSchema)])
}).strict();
export const WatchSpecV2CreateOrConnectWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchSpecV2CreateOrConnectWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecV2CreateOrConnectWithoutWatchInput>;
export const WatchSpecV2CreateOrConnectWithoutWatchInputObjectZodSchema = makeSchema();
