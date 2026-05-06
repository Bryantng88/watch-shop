import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewLogCreateWithoutReviewStateInputObjectSchema as WatchReviewLogCreateWithoutReviewStateInputObjectSchema } from './WatchReviewLogCreateWithoutReviewStateInput.schema';
import { WatchReviewLogUncheckedCreateWithoutReviewStateInputObjectSchema as WatchReviewLogUncheckedCreateWithoutReviewStateInputObjectSchema } from './WatchReviewLogUncheckedCreateWithoutReviewStateInput.schema';
import { WatchReviewLogCreateOrConnectWithoutReviewStateInputObjectSchema as WatchReviewLogCreateOrConnectWithoutReviewStateInputObjectSchema } from './WatchReviewLogCreateOrConnectWithoutReviewStateInput.schema';
import { WatchReviewLogCreateManyReviewStateInputEnvelopeObjectSchema as WatchReviewLogCreateManyReviewStateInputEnvelopeObjectSchema } from './WatchReviewLogCreateManyReviewStateInputEnvelope.schema';
import { WatchReviewLogWhereUniqueInputObjectSchema as WatchReviewLogWhereUniqueInputObjectSchema } from './WatchReviewLogWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchReviewLogCreateWithoutReviewStateInputObjectSchema), z.lazy(() => WatchReviewLogCreateWithoutReviewStateInputObjectSchema).array(), z.lazy(() => WatchReviewLogUncheckedCreateWithoutReviewStateInputObjectSchema), z.lazy(() => WatchReviewLogUncheckedCreateWithoutReviewStateInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WatchReviewLogCreateOrConnectWithoutReviewStateInputObjectSchema), z.lazy(() => WatchReviewLogCreateOrConnectWithoutReviewStateInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WatchReviewLogCreateManyReviewStateInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => WatchReviewLogWhereUniqueInputObjectSchema), z.lazy(() => WatchReviewLogWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const WatchReviewLogUncheckedCreateNestedManyWithoutReviewStateInputObjectSchema: z.ZodType<Prisma.WatchReviewLogUncheckedCreateNestedManyWithoutReviewStateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewLogUncheckedCreateNestedManyWithoutReviewStateInput>;
export const WatchReviewLogUncheckedCreateNestedManyWithoutReviewStateInputObjectZodSchema = makeSchema();
