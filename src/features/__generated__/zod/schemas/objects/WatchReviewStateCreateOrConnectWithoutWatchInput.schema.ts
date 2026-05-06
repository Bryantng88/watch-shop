import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStateWhereUniqueInputObjectSchema as WatchReviewStateWhereUniqueInputObjectSchema } from './WatchReviewStateWhereUniqueInput.schema';
import { WatchReviewStateCreateWithoutWatchInputObjectSchema as WatchReviewStateCreateWithoutWatchInputObjectSchema } from './WatchReviewStateCreateWithoutWatchInput.schema';
import { WatchReviewStateUncheckedCreateWithoutWatchInputObjectSchema as WatchReviewStateUncheckedCreateWithoutWatchInputObjectSchema } from './WatchReviewStateUncheckedCreateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchReviewStateWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchReviewStateCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchReviewStateUncheckedCreateWithoutWatchInputObjectSchema)])
}).strict();
export const WatchReviewStateCreateOrConnectWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchReviewStateCreateOrConnectWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateCreateOrConnectWithoutWatchInput>;
export const WatchReviewStateCreateOrConnectWithoutWatchInputObjectZodSchema = makeSchema();
