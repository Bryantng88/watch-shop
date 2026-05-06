import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStateWhereUniqueInputObjectSchema as WatchReviewStateWhereUniqueInputObjectSchema } from './WatchReviewStateWhereUniqueInput.schema';
import { WatchReviewStateUpdateWithoutWatchInputObjectSchema as WatchReviewStateUpdateWithoutWatchInputObjectSchema } from './WatchReviewStateUpdateWithoutWatchInput.schema';
import { WatchReviewStateUncheckedUpdateWithoutWatchInputObjectSchema as WatchReviewStateUncheckedUpdateWithoutWatchInputObjectSchema } from './WatchReviewStateUncheckedUpdateWithoutWatchInput.schema';
import { WatchReviewStateCreateWithoutWatchInputObjectSchema as WatchReviewStateCreateWithoutWatchInputObjectSchema } from './WatchReviewStateCreateWithoutWatchInput.schema';
import { WatchReviewStateUncheckedCreateWithoutWatchInputObjectSchema as WatchReviewStateUncheckedCreateWithoutWatchInputObjectSchema } from './WatchReviewStateUncheckedCreateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchReviewStateWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => WatchReviewStateUpdateWithoutWatchInputObjectSchema), z.lazy(() => WatchReviewStateUncheckedUpdateWithoutWatchInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchReviewStateCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchReviewStateUncheckedCreateWithoutWatchInputObjectSchema)])
}).strict();
export const WatchReviewStateUpsertWithWhereUniqueWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchReviewStateUpsertWithWhereUniqueWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateUpsertWithWhereUniqueWithoutWatchInput>;
export const WatchReviewStateUpsertWithWhereUniqueWithoutWatchInputObjectZodSchema = makeSchema();
