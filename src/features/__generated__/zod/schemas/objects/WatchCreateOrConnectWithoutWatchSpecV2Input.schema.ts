import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchCreateWithoutWatchSpecV2InputObjectSchema as WatchCreateWithoutWatchSpecV2InputObjectSchema } from './WatchCreateWithoutWatchSpecV2Input.schema';
import { WatchUncheckedCreateWithoutWatchSpecV2InputObjectSchema as WatchUncheckedCreateWithoutWatchSpecV2InputObjectSchema } from './WatchUncheckedCreateWithoutWatchSpecV2Input.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchCreateWithoutWatchSpecV2InputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWatchSpecV2InputObjectSchema)])
}).strict();
export const WatchCreateOrConnectWithoutWatchSpecV2InputObjectSchema: z.ZodType<Prisma.WatchCreateOrConnectWithoutWatchSpecV2Input> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateOrConnectWithoutWatchSpecV2Input>;
export const WatchCreateOrConnectWithoutWatchSpecV2InputObjectZodSchema = makeSchema();
