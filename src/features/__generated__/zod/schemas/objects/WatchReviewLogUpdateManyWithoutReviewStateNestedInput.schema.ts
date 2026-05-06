import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewLogCreateWithoutReviewStateInputObjectSchema as WatchReviewLogCreateWithoutReviewStateInputObjectSchema } from './WatchReviewLogCreateWithoutReviewStateInput.schema';
import { WatchReviewLogUncheckedCreateWithoutReviewStateInputObjectSchema as WatchReviewLogUncheckedCreateWithoutReviewStateInputObjectSchema } from './WatchReviewLogUncheckedCreateWithoutReviewStateInput.schema';
import { WatchReviewLogCreateOrConnectWithoutReviewStateInputObjectSchema as WatchReviewLogCreateOrConnectWithoutReviewStateInputObjectSchema } from './WatchReviewLogCreateOrConnectWithoutReviewStateInput.schema';
import { WatchReviewLogUpsertWithWhereUniqueWithoutReviewStateInputObjectSchema as WatchReviewLogUpsertWithWhereUniqueWithoutReviewStateInputObjectSchema } from './WatchReviewLogUpsertWithWhereUniqueWithoutReviewStateInput.schema';
import { WatchReviewLogCreateManyReviewStateInputEnvelopeObjectSchema as WatchReviewLogCreateManyReviewStateInputEnvelopeObjectSchema } from './WatchReviewLogCreateManyReviewStateInputEnvelope.schema';
import { WatchReviewLogWhereUniqueInputObjectSchema as WatchReviewLogWhereUniqueInputObjectSchema } from './WatchReviewLogWhereUniqueInput.schema';
import { WatchReviewLogUpdateWithWhereUniqueWithoutReviewStateInputObjectSchema as WatchReviewLogUpdateWithWhereUniqueWithoutReviewStateInputObjectSchema } from './WatchReviewLogUpdateWithWhereUniqueWithoutReviewStateInput.schema';
import { WatchReviewLogUpdateManyWithWhereWithoutReviewStateInputObjectSchema as WatchReviewLogUpdateManyWithWhereWithoutReviewStateInputObjectSchema } from './WatchReviewLogUpdateManyWithWhereWithoutReviewStateInput.schema';
import { WatchReviewLogScalarWhereInputObjectSchema as WatchReviewLogScalarWhereInputObjectSchema } from './WatchReviewLogScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchReviewLogCreateWithoutReviewStateInputObjectSchema), z.lazy(() => WatchReviewLogCreateWithoutReviewStateInputObjectSchema).array(), z.lazy(() => WatchReviewLogUncheckedCreateWithoutReviewStateInputObjectSchema), z.lazy(() => WatchReviewLogUncheckedCreateWithoutReviewStateInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WatchReviewLogCreateOrConnectWithoutReviewStateInputObjectSchema), z.lazy(() => WatchReviewLogCreateOrConnectWithoutReviewStateInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => WatchReviewLogUpsertWithWhereUniqueWithoutReviewStateInputObjectSchema), z.lazy(() => WatchReviewLogUpsertWithWhereUniqueWithoutReviewStateInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WatchReviewLogCreateManyReviewStateInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => WatchReviewLogWhereUniqueInputObjectSchema), z.lazy(() => WatchReviewLogWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => WatchReviewLogWhereUniqueInputObjectSchema), z.lazy(() => WatchReviewLogWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => WatchReviewLogWhereUniqueInputObjectSchema), z.lazy(() => WatchReviewLogWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WatchReviewLogWhereUniqueInputObjectSchema), z.lazy(() => WatchReviewLogWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => WatchReviewLogUpdateWithWhereUniqueWithoutReviewStateInputObjectSchema), z.lazy(() => WatchReviewLogUpdateWithWhereUniqueWithoutReviewStateInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => WatchReviewLogUpdateManyWithWhereWithoutReviewStateInputObjectSchema), z.lazy(() => WatchReviewLogUpdateManyWithWhereWithoutReviewStateInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => WatchReviewLogScalarWhereInputObjectSchema), z.lazy(() => WatchReviewLogScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const WatchReviewLogUpdateManyWithoutReviewStateNestedInputObjectSchema: z.ZodType<Prisma.WatchReviewLogUpdateManyWithoutReviewStateNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewLogUpdateManyWithoutReviewStateNestedInput>;
export const WatchReviewLogUpdateManyWithoutReviewStateNestedInputObjectZodSchema = makeSchema();
