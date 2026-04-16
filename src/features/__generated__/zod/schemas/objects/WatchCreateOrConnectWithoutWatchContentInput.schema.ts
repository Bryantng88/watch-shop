import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchCreateWithoutWatchContentInputObjectSchema as WatchCreateWithoutWatchContentInputObjectSchema } from './WatchCreateWithoutWatchContentInput.schema';
import { WatchUncheckedCreateWithoutWatchContentInputObjectSchema as WatchUncheckedCreateWithoutWatchContentInputObjectSchema } from './WatchUncheckedCreateWithoutWatchContentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchCreateWithoutWatchContentInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutWatchContentInputObjectSchema)])
}).strict();
export const WatchCreateOrConnectWithoutWatchContentInputObjectSchema: z.ZodType<Prisma.WatchCreateOrConnectWithoutWatchContentInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateOrConnectWithoutWatchContentInput>;
export const WatchCreateOrConnectWithoutWatchContentInputObjectZodSchema = makeSchema();
