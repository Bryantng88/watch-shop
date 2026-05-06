import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewLogWhereUniqueInputObjectSchema as WatchReviewLogWhereUniqueInputObjectSchema } from './WatchReviewLogWhereUniqueInput.schema';
import { WatchReviewLogUpdateWithoutReviewStateInputObjectSchema as WatchReviewLogUpdateWithoutReviewStateInputObjectSchema } from './WatchReviewLogUpdateWithoutReviewStateInput.schema';
import { WatchReviewLogUncheckedUpdateWithoutReviewStateInputObjectSchema as WatchReviewLogUncheckedUpdateWithoutReviewStateInputObjectSchema } from './WatchReviewLogUncheckedUpdateWithoutReviewStateInput.schema';
import { WatchReviewLogCreateWithoutReviewStateInputObjectSchema as WatchReviewLogCreateWithoutReviewStateInputObjectSchema } from './WatchReviewLogCreateWithoutReviewStateInput.schema';
import { WatchReviewLogUncheckedCreateWithoutReviewStateInputObjectSchema as WatchReviewLogUncheckedCreateWithoutReviewStateInputObjectSchema } from './WatchReviewLogUncheckedCreateWithoutReviewStateInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchReviewLogWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => WatchReviewLogUpdateWithoutReviewStateInputObjectSchema), z.lazy(() => WatchReviewLogUncheckedUpdateWithoutReviewStateInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchReviewLogCreateWithoutReviewStateInputObjectSchema), z.lazy(() => WatchReviewLogUncheckedCreateWithoutReviewStateInputObjectSchema)])
}).strict();
export const WatchReviewLogUpsertWithWhereUniqueWithoutReviewStateInputObjectSchema: z.ZodType<Prisma.WatchReviewLogUpsertWithWhereUniqueWithoutReviewStateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewLogUpsertWithWhereUniqueWithoutReviewStateInput>;
export const WatchReviewLogUpsertWithWhereUniqueWithoutReviewStateInputObjectZodSchema = makeSchema();
