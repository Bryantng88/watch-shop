import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStateCreateWithoutWatchInputObjectSchema as WatchReviewStateCreateWithoutWatchInputObjectSchema } from './WatchReviewStateCreateWithoutWatchInput.schema';
import { WatchReviewStateUncheckedCreateWithoutWatchInputObjectSchema as WatchReviewStateUncheckedCreateWithoutWatchInputObjectSchema } from './WatchReviewStateUncheckedCreateWithoutWatchInput.schema';
import { WatchReviewStateCreateOrConnectWithoutWatchInputObjectSchema as WatchReviewStateCreateOrConnectWithoutWatchInputObjectSchema } from './WatchReviewStateCreateOrConnectWithoutWatchInput.schema';
import { WatchReviewStateCreateManyWatchInputEnvelopeObjectSchema as WatchReviewStateCreateManyWatchInputEnvelopeObjectSchema } from './WatchReviewStateCreateManyWatchInputEnvelope.schema';
import { WatchReviewStateWhereUniqueInputObjectSchema as WatchReviewStateWhereUniqueInputObjectSchema } from './WatchReviewStateWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchReviewStateCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchReviewStateCreateWithoutWatchInputObjectSchema).array(), z.lazy(() => WatchReviewStateUncheckedCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchReviewStateUncheckedCreateWithoutWatchInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WatchReviewStateCreateOrConnectWithoutWatchInputObjectSchema), z.lazy(() => WatchReviewStateCreateOrConnectWithoutWatchInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WatchReviewStateCreateManyWatchInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => WatchReviewStateWhereUniqueInputObjectSchema), z.lazy(() => WatchReviewStateWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const WatchReviewStateCreateNestedManyWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchReviewStateCreateNestedManyWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateCreateNestedManyWithoutWatchInput>;
export const WatchReviewStateCreateNestedManyWithoutWatchInputObjectZodSchema = makeSchema();
