import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapInstallationWhereUniqueInputObjectSchema as WatchStrapInstallationWhereUniqueInputObjectSchema } from './WatchStrapInstallationWhereUniqueInput.schema';
import { WatchStrapInstallationCreateWithoutWatchInputObjectSchema as WatchStrapInstallationCreateWithoutWatchInputObjectSchema } from './WatchStrapInstallationCreateWithoutWatchInput.schema';
import { WatchStrapInstallationUncheckedCreateWithoutWatchInputObjectSchema as WatchStrapInstallationUncheckedCreateWithoutWatchInputObjectSchema } from './WatchStrapInstallationUncheckedCreateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchStrapInstallationCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchStrapInstallationUncheckedCreateWithoutWatchInputObjectSchema)])
}).strict();
export const WatchStrapInstallationCreateOrConnectWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationCreateOrConnectWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationCreateOrConnectWithoutWatchInput>;
export const WatchStrapInstallationCreateOrConnectWithoutWatchInputObjectZodSchema = makeSchema();
