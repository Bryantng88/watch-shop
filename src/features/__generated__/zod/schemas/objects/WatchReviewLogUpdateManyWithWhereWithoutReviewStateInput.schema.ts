import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewLogScalarWhereInputObjectSchema as WatchReviewLogScalarWhereInputObjectSchema } from './WatchReviewLogScalarWhereInput.schema';
import { WatchReviewLogUpdateManyMutationInputObjectSchema as WatchReviewLogUpdateManyMutationInputObjectSchema } from './WatchReviewLogUpdateManyMutationInput.schema';
import { WatchReviewLogUncheckedUpdateManyWithoutReviewStateInputObjectSchema as WatchReviewLogUncheckedUpdateManyWithoutReviewStateInputObjectSchema } from './WatchReviewLogUncheckedUpdateManyWithoutReviewStateInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchReviewLogScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => WatchReviewLogUpdateManyMutationInputObjectSchema), z.lazy(() => WatchReviewLogUncheckedUpdateManyWithoutReviewStateInputObjectSchema)])
}).strict();
export const WatchReviewLogUpdateManyWithWhereWithoutReviewStateInputObjectSchema: z.ZodType<Prisma.WatchReviewLogUpdateManyWithWhereWithoutReviewStateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewLogUpdateManyWithWhereWithoutReviewStateInput>;
export const WatchReviewLogUpdateManyWithWhereWithoutReviewStateInputObjectZodSchema = makeSchema();
