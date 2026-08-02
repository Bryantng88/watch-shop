import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchUpdateWithoutStrapInstallationsInputObjectSchema as WatchUpdateWithoutStrapInstallationsInputObjectSchema } from './WatchUpdateWithoutStrapInstallationsInput.schema';
import { WatchUncheckedUpdateWithoutStrapInstallationsInputObjectSchema as WatchUncheckedUpdateWithoutStrapInstallationsInputObjectSchema } from './WatchUncheckedUpdateWithoutStrapInstallationsInput.schema';
import { WatchCreateWithoutStrapInstallationsInputObjectSchema as WatchCreateWithoutStrapInstallationsInputObjectSchema } from './WatchCreateWithoutStrapInstallationsInput.schema';
import { WatchUncheckedCreateWithoutStrapInstallationsInputObjectSchema as WatchUncheckedCreateWithoutStrapInstallationsInputObjectSchema } from './WatchUncheckedCreateWithoutStrapInstallationsInput.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WatchUpdateWithoutStrapInstallationsInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutStrapInstallationsInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchCreateWithoutStrapInstallationsInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutStrapInstallationsInputObjectSchema)]),
  where: z.lazy(() => WatchWhereInputObjectSchema).optional()
}).strict();
export const WatchUpsertWithoutStrapInstallationsInputObjectSchema: z.ZodType<Prisma.WatchUpsertWithoutStrapInstallationsInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpsertWithoutStrapInstallationsInput>;
export const WatchUpsertWithoutStrapInstallationsInputObjectZodSchema = makeSchema();
