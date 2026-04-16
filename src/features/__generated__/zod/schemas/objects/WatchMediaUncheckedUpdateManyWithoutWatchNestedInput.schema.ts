import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchMediaCreateWithoutWatchInputObjectSchema as WatchMediaCreateWithoutWatchInputObjectSchema } from './WatchMediaCreateWithoutWatchInput.schema';
import { WatchMediaUncheckedCreateWithoutWatchInputObjectSchema as WatchMediaUncheckedCreateWithoutWatchInputObjectSchema } from './WatchMediaUncheckedCreateWithoutWatchInput.schema';
import { WatchMediaCreateOrConnectWithoutWatchInputObjectSchema as WatchMediaCreateOrConnectWithoutWatchInputObjectSchema } from './WatchMediaCreateOrConnectWithoutWatchInput.schema';
import { WatchMediaUpsertWithWhereUniqueWithoutWatchInputObjectSchema as WatchMediaUpsertWithWhereUniqueWithoutWatchInputObjectSchema } from './WatchMediaUpsertWithWhereUniqueWithoutWatchInput.schema';
import { WatchMediaCreateManyWatchInputEnvelopeObjectSchema as WatchMediaCreateManyWatchInputEnvelopeObjectSchema } from './WatchMediaCreateManyWatchInputEnvelope.schema';
import { WatchMediaWhereUniqueInputObjectSchema as WatchMediaWhereUniqueInputObjectSchema } from './WatchMediaWhereUniqueInput.schema';
import { WatchMediaUpdateWithWhereUniqueWithoutWatchInputObjectSchema as WatchMediaUpdateWithWhereUniqueWithoutWatchInputObjectSchema } from './WatchMediaUpdateWithWhereUniqueWithoutWatchInput.schema';
import { WatchMediaUpdateManyWithWhereWithoutWatchInputObjectSchema as WatchMediaUpdateManyWithWhereWithoutWatchInputObjectSchema } from './WatchMediaUpdateManyWithWhereWithoutWatchInput.schema';
import { WatchMediaScalarWhereInputObjectSchema as WatchMediaScalarWhereInputObjectSchema } from './WatchMediaScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchMediaCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchMediaCreateWithoutWatchInputObjectSchema).array(), z.lazy(() => WatchMediaUncheckedCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchMediaUncheckedCreateWithoutWatchInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WatchMediaCreateOrConnectWithoutWatchInputObjectSchema), z.lazy(() => WatchMediaCreateOrConnectWithoutWatchInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => WatchMediaUpsertWithWhereUniqueWithoutWatchInputObjectSchema), z.lazy(() => WatchMediaUpsertWithWhereUniqueWithoutWatchInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WatchMediaCreateManyWatchInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => WatchMediaWhereUniqueInputObjectSchema), z.lazy(() => WatchMediaWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => WatchMediaWhereUniqueInputObjectSchema), z.lazy(() => WatchMediaWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => WatchMediaWhereUniqueInputObjectSchema), z.lazy(() => WatchMediaWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WatchMediaWhereUniqueInputObjectSchema), z.lazy(() => WatchMediaWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => WatchMediaUpdateWithWhereUniqueWithoutWatchInputObjectSchema), z.lazy(() => WatchMediaUpdateWithWhereUniqueWithoutWatchInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => WatchMediaUpdateManyWithWhereWithoutWatchInputObjectSchema), z.lazy(() => WatchMediaUpdateManyWithWhereWithoutWatchInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => WatchMediaScalarWhereInputObjectSchema), z.lazy(() => WatchMediaScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const WatchMediaUncheckedUpdateManyWithoutWatchNestedInputObjectSchema: z.ZodType<Prisma.WatchMediaUncheckedUpdateManyWithoutWatchNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchMediaUncheckedUpdateManyWithoutWatchNestedInput>;
export const WatchMediaUncheckedUpdateManyWithoutWatchNestedInputObjectZodSchema = makeSchema();
