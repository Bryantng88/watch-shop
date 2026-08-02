import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapInstallationWhereUniqueInputObjectSchema as WatchStrapInstallationWhereUniqueInputObjectSchema } from './WatchStrapInstallationWhereUniqueInput.schema';
import { WatchStrapInstallationUpdateWithoutWatchInputObjectSchema as WatchStrapInstallationUpdateWithoutWatchInputObjectSchema } from './WatchStrapInstallationUpdateWithoutWatchInput.schema';
import { WatchStrapInstallationUncheckedUpdateWithoutWatchInputObjectSchema as WatchStrapInstallationUncheckedUpdateWithoutWatchInputObjectSchema } from './WatchStrapInstallationUncheckedUpdateWithoutWatchInput.schema';
import { WatchStrapInstallationCreateWithoutWatchInputObjectSchema as WatchStrapInstallationCreateWithoutWatchInputObjectSchema } from './WatchStrapInstallationCreateWithoutWatchInput.schema';
import { WatchStrapInstallationUncheckedCreateWithoutWatchInputObjectSchema as WatchStrapInstallationUncheckedCreateWithoutWatchInputObjectSchema } from './WatchStrapInstallationUncheckedCreateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => WatchStrapInstallationUpdateWithoutWatchInputObjectSchema), z.lazy(() => WatchStrapInstallationUncheckedUpdateWithoutWatchInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchStrapInstallationCreateWithoutWatchInputObjectSchema), z.lazy(() => WatchStrapInstallationUncheckedCreateWithoutWatchInputObjectSchema)])
}).strict();
export const WatchStrapInstallationUpsertWithWhereUniqueWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationUpsertWithWhereUniqueWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationUpsertWithWhereUniqueWithoutWatchInput>;
export const WatchStrapInstallationUpsertWithWhereUniqueWithoutWatchInputObjectZodSchema = makeSchema();
