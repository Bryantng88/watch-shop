import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapInstallationCreateWithoutWatchInputObjectSchema as WatchStrapInstallationCreateWithoutWatchInputObjectSchema } from './WatchStrapInstallationCreateWithoutWatchInput.schema';
import { WatchStrapInstallationUncheckedCreateWithoutWatchInputObjectSchema as WatchStrapInstallationUncheckedCreateWithoutWatchInputObjectSchema } from './WatchStrapInstallationUncheckedCreateWithoutWatchInput.schema';
import { WatchStrapInstallationCreateOrConnectWithoutWatchInputObjectSchema as WatchStrapInstallationCreateOrConnectWithoutWatchInputObjectSchema } from './WatchStrapInstallationCreateOrConnectWithoutWatchInput.schema';
import { WatchStrapInstallationUpsertWithWhereUniqueWithoutWatchInputObjectSchema as WatchStrapInstallationUpsertWithWhereUniqueWithoutWatchInputObjectSchema } from './WatchStrapInstallationUpsertWithWhereUniqueWithoutWatchInput.schema';
import { WatchStrapInstallationCreateManyWatchInputEnvelopeObjectSchema as WatchStrapInstallationCreateManyWatchInputEnvelopeObjectSchema } from './WatchStrapInstallationCreateManyWatchInputEnvelope.schema';
import { WatchStrapInstallationWhereUniqueInputObjectSchema as WatchStrapInstallationWhereUniqueInputObjectSchema } from './WatchStrapInstallationWhereUniqueInput.schema';
import { WatchStrapInstallationUpdateWithWhereUniqueWithoutWatchInputObjectSchema as WatchStrapInstallationUpdateWithWhereUniqueWithoutWatchInputObjectSchema } from './WatchStrapInstallationUpdateWithWhereUniqueWithoutWatchInput.schema';
import { WatchStrapInstallationUpdateManyWithWhereWithoutWatchInputObjectSchema as WatchStrapInstallationUpdateManyWithWhereWithoutWatchInputObjectSchema } from './WatchStrapInstallationUpdateManyWithWhereWithoutWatchInput.schema';
import { WatchStrapInstallationScalarWhereInputObjectSchema as WatchStrapInstallationScalarWhereInputObjectSchema } from './WatchStrapInstallationScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchStrapInstallationCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchStrapInstallationCreateWithoutWatchInputObjectSchema).array(), z.lazy(() => WatchStrapInstallationUncheckedCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchStrapInstallationUncheckedCreateWithoutWatchInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WatchStrapInstallationCreateOrConnectWithoutWatchInputObjectSchema), z.lazy(() => WatchStrapInstallationCreateOrConnectWithoutWatchInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => WatchStrapInstallationUpsertWithWhereUniqueWithoutWatchInputObjectSchema), z.lazy(() => WatchStrapInstallationUpsertWithWhereUniqueWithoutWatchInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WatchStrapInstallationCreateManyWatchInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema), z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema), z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema), z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema), z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => WatchStrapInstallationUpdateWithWhereUniqueWithoutWatchInputObjectSchema), z.lazy(() => WatchStrapInstallationUpdateWithWhereUniqueWithoutWatchInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => WatchStrapInstallationUpdateManyWithWhereWithoutWatchInputObjectSchema), z.lazy(() => WatchStrapInstallationUpdateManyWithWhereWithoutWatchInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => WatchStrapInstallationScalarWhereInputObjectSchema), z.lazy(() => WatchStrapInstallationScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const WatchStrapInstallationUpdateManyWithoutWatchNestedInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationUpdateManyWithoutWatchNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationUpdateManyWithoutWatchNestedInput>;
export const WatchStrapInstallationUpdateManyWithoutWatchNestedInputObjectZodSchema = makeSchema();
