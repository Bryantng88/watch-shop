import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapInstallationScalarWhereInputObjectSchema as WatchStrapInstallationScalarWhereInputObjectSchema } from './WatchStrapInstallationScalarWhereInput.schema';
import { WatchStrapInstallationUpdateManyMutationInputObjectSchema as WatchStrapInstallationUpdateManyMutationInputObjectSchema } from './WatchStrapInstallationUpdateManyMutationInput.schema';
import { WatchStrapInstallationUncheckedUpdateManyWithoutWatchInputObjectSchema as WatchStrapInstallationUncheckedUpdateManyWithoutWatchInputObjectSchema } from './WatchStrapInstallationUncheckedUpdateManyWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchStrapInstallationScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => WatchStrapInstallationUpdateManyMutationInputObjectSchema), z.lazy(() => WatchStrapInstallationUncheckedUpdateManyWithoutWatchInputObjectSchema)])
}).strict();
export const WatchStrapInstallationUpdateManyWithWhereWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationUpdateManyWithWhereWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationUpdateManyWithWhereWithoutWatchInput>;
export const WatchStrapInstallationUpdateManyWithWhereWithoutWatchInputObjectZodSchema = makeSchema();
