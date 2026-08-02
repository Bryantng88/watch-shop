import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchCreateWithoutStrapInstallationsInputObjectSchema as WatchCreateWithoutStrapInstallationsInputObjectSchema } from './WatchCreateWithoutStrapInstallationsInput.schema';
import { WatchUncheckedCreateWithoutStrapInstallationsInputObjectSchema as WatchUncheckedCreateWithoutStrapInstallationsInputObjectSchema } from './WatchUncheckedCreateWithoutStrapInstallationsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchCreateWithoutStrapInstallationsInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutStrapInstallationsInputObjectSchema)])
}).strict();
export const WatchCreateOrConnectWithoutStrapInstallationsInputObjectSchema: z.ZodType<Prisma.WatchCreateOrConnectWithoutStrapInstallationsInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateOrConnectWithoutStrapInstallationsInput>;
export const WatchCreateOrConnectWithoutStrapInstallationsInputObjectZodSchema = makeSchema();
