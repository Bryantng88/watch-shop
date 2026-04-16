import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchMediaWhereUniqueInputObjectSchema as WatchMediaWhereUniqueInputObjectSchema } from './WatchMediaWhereUniqueInput.schema';
import { WatchMediaCreateWithoutWatchInputObjectSchema as WatchMediaCreateWithoutWatchInputObjectSchema } from './WatchMediaCreateWithoutWatchInput.schema';
import { WatchMediaUncheckedCreateWithoutWatchInputObjectSchema as WatchMediaUncheckedCreateWithoutWatchInputObjectSchema } from './WatchMediaUncheckedCreateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchMediaWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchMediaCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchMediaUncheckedCreateWithoutWatchInputObjectSchema)])
}).strict();
export const WatchMediaCreateOrConnectWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchMediaCreateOrConnectWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchMediaCreateOrConnectWithoutWatchInput>;
export const WatchMediaCreateOrConnectWithoutWatchInputObjectZodSchema = makeSchema();
