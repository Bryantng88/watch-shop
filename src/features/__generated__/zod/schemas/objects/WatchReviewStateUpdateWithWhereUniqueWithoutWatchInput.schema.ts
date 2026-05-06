import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStateWhereUniqueInputObjectSchema as WatchReviewStateWhereUniqueInputObjectSchema } from './WatchReviewStateWhereUniqueInput.schema';
import { WatchReviewStateUpdateWithoutWatchInputObjectSchema as WatchReviewStateUpdateWithoutWatchInputObjectSchema } from './WatchReviewStateUpdateWithoutWatchInput.schema';
import { WatchReviewStateUncheckedUpdateWithoutWatchInputObjectSchema as WatchReviewStateUncheckedUpdateWithoutWatchInputObjectSchema } from './WatchReviewStateUncheckedUpdateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchReviewStateWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => WatchReviewStateUpdateWithoutWatchInputObjectSchema), z.lazy(() => WatchReviewStateUncheckedUpdateWithoutWatchInputObjectSchema)])
}).strict();
export const WatchReviewStateUpdateWithWhereUniqueWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchReviewStateUpdateWithWhereUniqueWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateUpdateWithWhereUniqueWithoutWatchInput>;
export const WatchReviewStateUpdateWithWhereUniqueWithoutWatchInputObjectZodSchema = makeSchema();
