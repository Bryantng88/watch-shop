import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStateCreateWithoutWatchInputObjectSchema as WatchReviewStateCreateWithoutWatchInputObjectSchema } from './WatchReviewStateCreateWithoutWatchInput.schema';
import { WatchReviewStateUncheckedCreateWithoutWatchInputObjectSchema as WatchReviewStateUncheckedCreateWithoutWatchInputObjectSchema } from './WatchReviewStateUncheckedCreateWithoutWatchInput.schema';
import { WatchReviewStateCreateOrConnectWithoutWatchInputObjectSchema as WatchReviewStateCreateOrConnectWithoutWatchInputObjectSchema } from './WatchReviewStateCreateOrConnectWithoutWatchInput.schema';
import { WatchReviewStateUpsertWithWhereUniqueWithoutWatchInputObjectSchema as WatchReviewStateUpsertWithWhereUniqueWithoutWatchInputObjectSchema } from './WatchReviewStateUpsertWithWhereUniqueWithoutWatchInput.schema';
import { WatchReviewStateCreateManyWatchInputEnvelopeObjectSchema as WatchReviewStateCreateManyWatchInputEnvelopeObjectSchema } from './WatchReviewStateCreateManyWatchInputEnvelope.schema';
import { WatchReviewStateWhereUniqueInputObjectSchema as WatchReviewStateWhereUniqueInputObjectSchema } from './WatchReviewStateWhereUniqueInput.schema';
import { WatchReviewStateUpdateWithWhereUniqueWithoutWatchInputObjectSchema as WatchReviewStateUpdateWithWhereUniqueWithoutWatchInputObjectSchema } from './WatchReviewStateUpdateWithWhereUniqueWithoutWatchInput.schema';
import { WatchReviewStateUpdateManyWithWhereWithoutWatchInputObjectSchema as WatchReviewStateUpdateManyWithWhereWithoutWatchInputObjectSchema } from './WatchReviewStateUpdateManyWithWhereWithoutWatchInput.schema';
import { WatchReviewStateScalarWhereInputObjectSchema as WatchReviewStateScalarWhereInputObjectSchema } from './WatchReviewStateScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchReviewStateCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchReviewStateCreateWithoutWatchInputObjectSchema).array(), z.lazy(() => WatchReviewStateUncheckedCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchReviewStateUncheckedCreateWithoutWatchInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WatchReviewStateCreateOrConnectWithoutWatchInputObjectSchema), z.lazy(() => WatchReviewStateCreateOrConnectWithoutWatchInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => WatchReviewStateUpsertWithWhereUniqueWithoutWatchInputObjectSchema), z.lazy(() => WatchReviewStateUpsertWithWhereUniqueWithoutWatchInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WatchReviewStateCreateManyWatchInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => WatchReviewStateWhereUniqueInputObjectSchema), z.lazy(() => WatchReviewStateWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => WatchReviewStateWhereUniqueInputObjectSchema), z.lazy(() => WatchReviewStateWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => WatchReviewStateWhereUniqueInputObjectSchema), z.lazy(() => WatchReviewStateWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WatchReviewStateWhereUniqueInputObjectSchema), z.lazy(() => WatchReviewStateWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => WatchReviewStateUpdateWithWhereUniqueWithoutWatchInputObjectSchema), z.lazy(() => WatchReviewStateUpdateWithWhereUniqueWithoutWatchInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => WatchReviewStateUpdateManyWithWhereWithoutWatchInputObjectSchema), z.lazy(() => WatchReviewStateUpdateManyWithWhereWithoutWatchInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => WatchReviewStateScalarWhereInputObjectSchema), z.lazy(() => WatchReviewStateScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const WatchReviewStateUpdateManyWithoutWatchNestedInputObjectSchema: z.ZodType<Prisma.WatchReviewStateUpdateManyWithoutWatchNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateUpdateManyWithoutWatchNestedInput>;
export const WatchReviewStateUpdateManyWithoutWatchNestedInputObjectZodSchema = makeSchema();
