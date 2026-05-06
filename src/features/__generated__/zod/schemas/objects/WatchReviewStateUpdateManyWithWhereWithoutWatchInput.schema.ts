import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStateScalarWhereInputObjectSchema as WatchReviewStateScalarWhereInputObjectSchema } from './WatchReviewStateScalarWhereInput.schema';
import { WatchReviewStateUpdateManyMutationInputObjectSchema as WatchReviewStateUpdateManyMutationInputObjectSchema } from './WatchReviewStateUpdateManyMutationInput.schema';
import { WatchReviewStateUncheckedUpdateManyWithoutWatchInputObjectSchema as WatchReviewStateUncheckedUpdateManyWithoutWatchInputObjectSchema } from './WatchReviewStateUncheckedUpdateManyWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchReviewStateScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => WatchReviewStateUpdateManyMutationInputObjectSchema), z.lazy(() => WatchReviewStateUncheckedUpdateManyWithoutWatchInputObjectSchema)])
}).strict();
export const WatchReviewStateUpdateManyWithWhereWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchReviewStateUpdateManyWithWhereWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateUpdateManyWithWhereWithoutWatchInput>;
export const WatchReviewStateUpdateManyWithWhereWithoutWatchInputObjectZodSchema = makeSchema();
