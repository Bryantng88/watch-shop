import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapInstallationCreateWithoutWatchInputObjectSchema as WatchStrapInstallationCreateWithoutWatchInputObjectSchema } from './WatchStrapInstallationCreateWithoutWatchInput.schema';
import { WatchStrapInstallationUncheckedCreateWithoutWatchInputObjectSchema as WatchStrapInstallationUncheckedCreateWithoutWatchInputObjectSchema } from './WatchStrapInstallationUncheckedCreateWithoutWatchInput.schema';
import { WatchStrapInstallationCreateOrConnectWithoutWatchInputObjectSchema as WatchStrapInstallationCreateOrConnectWithoutWatchInputObjectSchema } from './WatchStrapInstallationCreateOrConnectWithoutWatchInput.schema';
import { WatchStrapInstallationCreateManyWatchInputEnvelopeObjectSchema as WatchStrapInstallationCreateManyWatchInputEnvelopeObjectSchema } from './WatchStrapInstallationCreateManyWatchInputEnvelope.schema';
import { WatchStrapInstallationWhereUniqueInputObjectSchema as WatchStrapInstallationWhereUniqueInputObjectSchema } from './WatchStrapInstallationWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchStrapInstallationCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchStrapInstallationCreateWithoutWatchInputObjectSchema).array(), z.lazy(() => WatchStrapInstallationUncheckedCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchStrapInstallationUncheckedCreateWithoutWatchInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WatchStrapInstallationCreateOrConnectWithoutWatchInputObjectSchema), z.lazy(() => WatchStrapInstallationCreateOrConnectWithoutWatchInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WatchStrapInstallationCreateManyWatchInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema), z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const WatchStrapInstallationCreateNestedManyWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationCreateNestedManyWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationCreateNestedManyWithoutWatchInput>;
export const WatchStrapInstallationCreateNestedManyWithoutWatchInputObjectZodSchema = makeSchema();
