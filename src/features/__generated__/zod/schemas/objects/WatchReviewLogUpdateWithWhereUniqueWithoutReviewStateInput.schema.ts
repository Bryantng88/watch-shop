import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewLogWhereUniqueInputObjectSchema as WatchReviewLogWhereUniqueInputObjectSchema } from './WatchReviewLogWhereUniqueInput.schema';
import { WatchReviewLogUpdateWithoutReviewStateInputObjectSchema as WatchReviewLogUpdateWithoutReviewStateInputObjectSchema } from './WatchReviewLogUpdateWithoutReviewStateInput.schema';
import { WatchReviewLogUncheckedUpdateWithoutReviewStateInputObjectSchema as WatchReviewLogUncheckedUpdateWithoutReviewStateInputObjectSchema } from './WatchReviewLogUncheckedUpdateWithoutReviewStateInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchReviewLogWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => WatchReviewLogUpdateWithoutReviewStateInputObjectSchema), z.lazy(() => WatchReviewLogUncheckedUpdateWithoutReviewStateInputObjectSchema)])
}).strict();
export const WatchReviewLogUpdateWithWhereUniqueWithoutReviewStateInputObjectSchema: z.ZodType<Prisma.WatchReviewLogUpdateWithWhereUniqueWithoutReviewStateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewLogUpdateWithWhereUniqueWithoutReviewStateInput>;
export const WatchReviewLogUpdateWithWhereUniqueWithoutReviewStateInputObjectZodSchema = makeSchema();
