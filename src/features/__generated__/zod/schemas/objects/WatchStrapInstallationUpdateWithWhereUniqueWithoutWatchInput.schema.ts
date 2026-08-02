import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapInstallationWhereUniqueInputObjectSchema as WatchStrapInstallationWhereUniqueInputObjectSchema } from './WatchStrapInstallationWhereUniqueInput.schema';
import { WatchStrapInstallationUpdateWithoutWatchInputObjectSchema as WatchStrapInstallationUpdateWithoutWatchInputObjectSchema } from './WatchStrapInstallationUpdateWithoutWatchInput.schema';
import { WatchStrapInstallationUncheckedUpdateWithoutWatchInputObjectSchema as WatchStrapInstallationUncheckedUpdateWithoutWatchInputObjectSchema } from './WatchStrapInstallationUncheckedUpdateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => WatchStrapInstallationUpdateWithoutWatchInputObjectSchema), z.lazy(() => WatchStrapInstallationUncheckedUpdateWithoutWatchInputObjectSchema)])
}).strict();
export const WatchStrapInstallationUpdateWithWhereUniqueWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationUpdateWithWhereUniqueWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationUpdateWithWhereUniqueWithoutWatchInput>;
export const WatchStrapInstallationUpdateWithWhereUniqueWithoutWatchInputObjectZodSchema = makeSchema();
