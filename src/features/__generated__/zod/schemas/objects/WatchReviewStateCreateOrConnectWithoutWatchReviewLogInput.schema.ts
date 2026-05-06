import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStateWhereUniqueInputObjectSchema as WatchReviewStateWhereUniqueInputObjectSchema } from './WatchReviewStateWhereUniqueInput.schema';
import { WatchReviewStateCreateWithoutWatchReviewLogInputObjectSchema as WatchReviewStateCreateWithoutWatchReviewLogInputObjectSchema } from './WatchReviewStateCreateWithoutWatchReviewLogInput.schema';
import { WatchReviewStateUncheckedCreateWithoutWatchReviewLogInputObjectSchema as WatchReviewStateUncheckedCreateWithoutWatchReviewLogInputObjectSchema } from './WatchReviewStateUncheckedCreateWithoutWatchReviewLogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchReviewStateWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchReviewStateCreateWithoutWatchReviewLogInputObjectSchema), z.lazy(() => WatchReviewStateUncheckedCreateWithoutWatchReviewLogInputObjectSchema)])
}).strict();
export const WatchReviewStateCreateOrConnectWithoutWatchReviewLogInputObjectSchema: z.ZodType<Prisma.WatchReviewStateCreateOrConnectWithoutWatchReviewLogInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateCreateOrConnectWithoutWatchReviewLogInput>;
export const WatchReviewStateCreateOrConnectWithoutWatchReviewLogInputObjectZodSchema = makeSchema();
