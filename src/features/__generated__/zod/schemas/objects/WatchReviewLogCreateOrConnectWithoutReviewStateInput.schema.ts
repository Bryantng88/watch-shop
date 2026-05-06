import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewLogWhereUniqueInputObjectSchema as WatchReviewLogWhereUniqueInputObjectSchema } from './WatchReviewLogWhereUniqueInput.schema';
import { WatchReviewLogCreateWithoutReviewStateInputObjectSchema as WatchReviewLogCreateWithoutReviewStateInputObjectSchema } from './WatchReviewLogCreateWithoutReviewStateInput.schema';
import { WatchReviewLogUncheckedCreateWithoutReviewStateInputObjectSchema as WatchReviewLogUncheckedCreateWithoutReviewStateInputObjectSchema } from './WatchReviewLogUncheckedCreateWithoutReviewStateInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchReviewLogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchReviewLogCreateWithoutReviewStateInputObjectSchema), z.lazy(() => WatchReviewLogUncheckedCreateWithoutReviewStateInputObjectSchema)])
}).strict();
export const WatchReviewLogCreateOrConnectWithoutReviewStateInputObjectSchema: z.ZodType<Prisma.WatchReviewLogCreateOrConnectWithoutReviewStateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewLogCreateOrConnectWithoutReviewStateInput>;
export const WatchReviewLogCreateOrConnectWithoutReviewStateInputObjectZodSchema = makeSchema();
