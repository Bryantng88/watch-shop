import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutStrapInstallationsInputObjectSchema as WatchCreateWithoutStrapInstallationsInputObjectSchema } from './WatchCreateWithoutStrapInstallationsInput.schema';
import { WatchUncheckedCreateWithoutStrapInstallationsInputObjectSchema as WatchUncheckedCreateWithoutStrapInstallationsInputObjectSchema } from './WatchUncheckedCreateWithoutStrapInstallationsInput.schema';
import { WatchCreateOrConnectWithoutStrapInstallationsInputObjectSchema as WatchCreateOrConnectWithoutStrapInstallationsInputObjectSchema } from './WatchCreateOrConnectWithoutStrapInstallationsInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutStrapInstallationsInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutStrapInstallationsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutStrapInstallationsInputObjectSchema).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional()
}).strict();
export const WatchCreateNestedOneWithoutStrapInstallationsInputObjectSchema: z.ZodType<Prisma.WatchCreateNestedOneWithoutStrapInstallationsInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchCreateNestedOneWithoutStrapInstallationsInput>;
export const WatchCreateNestedOneWithoutStrapInstallationsInputObjectZodSchema = makeSchema();
