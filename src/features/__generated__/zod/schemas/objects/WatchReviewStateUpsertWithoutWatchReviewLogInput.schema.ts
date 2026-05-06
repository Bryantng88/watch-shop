import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStateUpdateWithoutWatchReviewLogInputObjectSchema as WatchReviewStateUpdateWithoutWatchReviewLogInputObjectSchema } from './WatchReviewStateUpdateWithoutWatchReviewLogInput.schema';
import { WatchReviewStateUncheckedUpdateWithoutWatchReviewLogInputObjectSchema as WatchReviewStateUncheckedUpdateWithoutWatchReviewLogInputObjectSchema } from './WatchReviewStateUncheckedUpdateWithoutWatchReviewLogInput.schema';
import { WatchReviewStateCreateWithoutWatchReviewLogInputObjectSchema as WatchReviewStateCreateWithoutWatchReviewLogInputObjectSchema } from './WatchReviewStateCreateWithoutWatchReviewLogInput.schema';
import { WatchReviewStateUncheckedCreateWithoutWatchReviewLogInputObjectSchema as WatchReviewStateUncheckedCreateWithoutWatchReviewLogInputObjectSchema } from './WatchReviewStateUncheckedCreateWithoutWatchReviewLogInput.schema';
import { WatchReviewStateWhereInputObjectSchema as WatchReviewStateWhereInputObjectSchema } from './WatchReviewStateWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WatchReviewStateUpdateWithoutWatchReviewLogInputObjectSchema), z.lazy(() => WatchReviewStateUncheckedUpdateWithoutWatchReviewLogInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchReviewStateCreateWithoutWatchReviewLogInputObjectSchema), z.lazy(() => WatchReviewStateUncheckedCreateWithoutWatchReviewLogInputObjectSchema)]),
  where: z.lazy(() => WatchReviewStateWhereInputObjectSchema).optional()
}).strict();
export const WatchReviewStateUpsertWithoutWatchReviewLogInputObjectSchema: z.ZodType<Prisma.WatchReviewStateUpsertWithoutWatchReviewLogInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateUpsertWithoutWatchReviewLogInput>;
export const WatchReviewStateUpsertWithoutWatchReviewLogInputObjectZodSchema = makeSchema();
