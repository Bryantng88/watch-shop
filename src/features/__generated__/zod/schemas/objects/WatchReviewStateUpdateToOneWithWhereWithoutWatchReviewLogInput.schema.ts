import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStateWhereInputObjectSchema as WatchReviewStateWhereInputObjectSchema } from './WatchReviewStateWhereInput.schema';
import { WatchReviewStateUpdateWithoutWatchReviewLogInputObjectSchema as WatchReviewStateUpdateWithoutWatchReviewLogInputObjectSchema } from './WatchReviewStateUpdateWithoutWatchReviewLogInput.schema';
import { WatchReviewStateUncheckedUpdateWithoutWatchReviewLogInputObjectSchema as WatchReviewStateUncheckedUpdateWithoutWatchReviewLogInputObjectSchema } from './WatchReviewStateUncheckedUpdateWithoutWatchReviewLogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchReviewStateWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WatchReviewStateUpdateWithoutWatchReviewLogInputObjectSchema), z.lazy(() => WatchReviewStateUncheckedUpdateWithoutWatchReviewLogInputObjectSchema)])
}).strict();
export const WatchReviewStateUpdateToOneWithWhereWithoutWatchReviewLogInputObjectSchema: z.ZodType<Prisma.WatchReviewStateUpdateToOneWithWhereWithoutWatchReviewLogInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateUpdateToOneWithWhereWithoutWatchReviewLogInput>;
export const WatchReviewStateUpdateToOneWithWhereWithoutWatchReviewLogInputObjectZodSchema = makeSchema();
