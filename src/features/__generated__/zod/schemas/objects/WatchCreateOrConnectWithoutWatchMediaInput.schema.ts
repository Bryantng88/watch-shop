import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchCreateWithoutWatchMediaInputObjectSchema as WatchCreateWithoutWatchMediaInputObjectSchema } from './WatchCreateWithoutWatchMediaInput.schema';
import { WatchUncheckedCreateWithoutWatchMediaInputObjectSchema as WatchUncheckedCreateWithoutWatchMediaInputObjectSchema } from './WatchUncheckedCreateWithoutWatchMediaInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchCreateWithoutWatchMediaInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWatchMediaInputObjectSchema)])
}).strict();
export const WatchCreateOrConnectWithoutWatchMediaInputObjectSchema: z.ZodType<Prisma.WatchCreateOrConnectWithoutWatchMediaInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateOrConnectWithoutWatchMediaInput>;
export const WatchCreateOrConnectWithoutWatchMediaInputObjectZodSchema = makeSchema();
