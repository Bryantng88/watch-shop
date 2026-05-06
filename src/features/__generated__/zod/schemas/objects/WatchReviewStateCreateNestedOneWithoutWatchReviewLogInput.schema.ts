import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStateCreateWithoutWatchReviewLogInputObjectSchema as WatchReviewStateCreateWithoutWatchReviewLogInputObjectSchema } from './WatchReviewStateCreateWithoutWatchReviewLogInput.schema';
import { WatchReviewStateUncheckedCreateWithoutWatchReviewLogInputObjectSchema as WatchReviewStateUncheckedCreateWithoutWatchReviewLogInputObjectSchema } from './WatchReviewStateUncheckedCreateWithoutWatchReviewLogInput.schema';
import { WatchReviewStateCreateOrConnectWithoutWatchReviewLogInputObjectSchema as WatchReviewStateCreateOrConnectWithoutWatchReviewLogInputObjectSchema } from './WatchReviewStateCreateOrConnectWithoutWatchReviewLogInput.schema';
import { WatchReviewStateWhereUniqueInputObjectSchema as WatchReviewStateWhereUniqueInputObjectSchema } from './WatchReviewStateWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchReviewStateCreateWithoutWatchReviewLogInputObjectSchema), z.lazy(() => WatchReviewStateUncheckedCreateWithoutWatchReviewLogInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchReviewStateCreateOrConnectWithoutWatchReviewLogInputObjectSchema).optional(),
  connect: z.lazy(() => WatchReviewStateWhereUniqueInputObjectSchema).optional()
}).strict();
export const WatchReviewStateCreateNestedOneWithoutWatchReviewLogInputObjectSchema: z.ZodType<Prisma.WatchReviewStateCreateNestedOneWithoutWatchReviewLogInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateCreateNestedOneWithoutWatchReviewLogInput>;
export const WatchReviewStateCreateNestedOneWithoutWatchReviewLogInputObjectZodSchema = makeSchema();
