import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchContentWhereUniqueInputObjectSchema as WatchContentWhereUniqueInputObjectSchema } from './WatchContentWhereUniqueInput.schema';
import { WatchContentCreateWithoutWatchInputObjectSchema as WatchContentCreateWithoutWatchInputObjectSchema } from './WatchContentCreateWithoutWatchInput.schema';
import { WatchContentUncheckedCreateWithoutWatchInputObjectSchema as WatchContentUncheckedCreateWithoutWatchInputObjectSchema } from './WatchContentUncheckedCreateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchContentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchContentCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchContentUncheckedCreateWithoutWatchInputObjectSchema)])
}).strict();
export const WatchContentCreateOrConnectWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchContentCreateOrConnectWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchContentCreateOrConnectWithoutWatchInput>;
export const WatchContentCreateOrConnectWithoutWatchInputObjectZodSchema = makeSchema();
