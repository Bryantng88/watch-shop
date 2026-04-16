import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecCreateWithoutMarketSegmentInputObjectSchema as WatchSpecCreateWithoutMarketSegmentInputObjectSchema } from './WatchSpecCreateWithoutMarketSegmentInput.schema';
import { WatchSpecUncheckedCreateWithoutMarketSegmentInputObjectSchema as WatchSpecUncheckedCreateWithoutMarketSegmentInputObjectSchema } from './WatchSpecUncheckedCreateWithoutMarketSegmentInput.schema';
import { WatchSpecCreateOrConnectWithoutMarketSegmentInputObjectSchema as WatchSpecCreateOrConnectWithoutMarketSegmentInputObjectSchema } from './WatchSpecCreateOrConnectWithoutMarketSegmentInput.schema';
import { WatchSpecUpsertWithWhereUniqueWithoutMarketSegmentInputObjectSchema as WatchSpecUpsertWithWhereUniqueWithoutMarketSegmentInputObjectSchema } from './WatchSpecUpsertWithWhereUniqueWithoutMarketSegmentInput.schema';
import { WatchSpecWhereUniqueInputObjectSchema as WatchSpecWhereUniqueInputObjectSchema } from './WatchSpecWhereUniqueInput.schema';
import { WatchSpecUpdateWithWhereUniqueWithoutMarketSegmentInputObjectSchema as WatchSpecUpdateWithWhereUniqueWithoutMarketSegmentInputObjectSchema } from './WatchSpecUpdateWithWhereUniqueWithoutMarketSegmentInput.schema';
import { WatchSpecUpdateManyWithWhereWithoutMarketSegmentInputObjectSchema as WatchSpecUpdateManyWithWhereWithoutMarketSegmentInputObjectSchema } from './WatchSpecUpdateManyWithWhereWithoutMarketSegmentInput.schema';
import { WatchSpecScalarWhereInputObjectSchema as WatchSpecScalarWhereInputObjectSchema } from './WatchSpecScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchSpecCreateWithoutMarketSegmentInputObjectSchema), z.lazy(() => WatchSpecCreateWithoutMarketSegmentInputObjectSchema).array(), z.lazy(() => WatchSpecUncheckedCreateWithoutMarketSegmentInputObjectSchema), z.lazy(() => WatchSpecUncheckedCreateWithoutMarketSegmentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WatchSpecCreateOrConnectWithoutMarketSegmentInputObjectSchema), z.lazy(() => WatchSpecCreateOrConnectWithoutMarketSegmentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => WatchSpecUpsertWithWhereUniqueWithoutMarketSegmentInputObjectSchema), z.lazy(() => WatchSpecUpsertWithWhereUniqueWithoutMarketSegmentInputObjectSchema).array()]).optional(),
  set: z.union([z.lazy(() => WatchSpecWhereUniqueInputObjectSchema), z.lazy(() => WatchSpecWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => WatchSpecWhereUniqueInputObjectSchema), z.lazy(() => WatchSpecWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => WatchSpecWhereUniqueInputObjectSchema), z.lazy(() => WatchSpecWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WatchSpecWhereUniqueInputObjectSchema), z.lazy(() => WatchSpecWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => WatchSpecUpdateWithWhereUniqueWithoutMarketSegmentInputObjectSchema), z.lazy(() => WatchSpecUpdateWithWhereUniqueWithoutMarketSegmentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => WatchSpecUpdateManyWithWhereWithoutMarketSegmentInputObjectSchema), z.lazy(() => WatchSpecUpdateManyWithWhereWithoutMarketSegmentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => WatchSpecScalarWhereInputObjectSchema), z.lazy(() => WatchSpecScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const WatchSpecUpdateManyWithoutMarketSegmentNestedInputObjectSchema: z.ZodType<Prisma.WatchSpecUpdateManyWithoutMarketSegmentNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecUpdateManyWithoutMarketSegmentNestedInput>;
export const WatchSpecUpdateManyWithoutMarketSegmentNestedInputObjectZodSchema = makeSchema();
