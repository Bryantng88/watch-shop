import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchMediaWhereUniqueInputObjectSchema as WatchMediaWhereUniqueInputObjectSchema } from './WatchMediaWhereUniqueInput.schema';
import { WatchMediaUpdateWithoutWatchInputObjectSchema as WatchMediaUpdateWithoutWatchInputObjectSchema } from './WatchMediaUpdateWithoutWatchInput.schema';
import { WatchMediaUncheckedUpdateWithoutWatchInputObjectSchema as WatchMediaUncheckedUpdateWithoutWatchInputObjectSchema } from './WatchMediaUncheckedUpdateWithoutWatchInput.schema';
import { WatchMediaCreateWithoutWatchInputObjectSchema as WatchMediaCreateWithoutWatchInputObjectSchema } from './WatchMediaCreateWithoutWatchInput.schema';
import { WatchMediaUncheckedCreateWithoutWatchInputObjectSchema as WatchMediaUncheckedCreateWithoutWatchInputObjectSchema } from './WatchMediaUncheckedCreateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchMediaWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => WatchMediaUpdateWithoutWatchInputObjectSchema), z.lazy(() => WatchMediaUncheckedUpdateWithoutWatchInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchMediaCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchMediaUncheckedCreateWithoutWatchInputObjectSchema)])
}).strict();
export const WatchMediaUpsertWithWhereUniqueWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchMediaUpsertWithWhereUniqueWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchMediaUpsertWithWhereUniqueWithoutWatchInput>;
export const WatchMediaUpsertWithWhereUniqueWithoutWatchInputObjectZodSchema = makeSchema();
