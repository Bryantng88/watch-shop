import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCreateWithoutStrapInstallationsInputObjectSchema as WatchCreateWithoutStrapInstallationsInputObjectSchema } from './WatchCreateWithoutStrapInstallationsInput.schema';
import { WatchUncheckedCreateWithoutStrapInstallationsInputObjectSchema as WatchUncheckedCreateWithoutStrapInstallationsInputObjectSchema } from './WatchUncheckedCreateWithoutStrapInstallationsInput.schema';
import { WatchCreateOrConnectWithoutStrapInstallationsInputObjectSchema as WatchCreateOrConnectWithoutStrapInstallationsInputObjectSchema } from './WatchCreateOrConnectWithoutStrapInstallationsInput.schema';
import { WatchUpsertWithoutStrapInstallationsInputObjectSchema as WatchUpsertWithoutStrapInstallationsInputObjectSchema } from './WatchUpsertWithoutStrapInstallationsInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './WatchWhereUniqueInput.schema';
import { WatchUpdateToOneWithWhereWithoutStrapInstallationsInputObjectSchema as WatchUpdateToOneWithWhereWithoutStrapInstallationsInputObjectSchema } from './WatchUpdateToOneWithWhereWithoutStrapInstallationsInput.schema';
import { WatchUpdateWithoutStrapInstallationsInputObjectSchema as WatchUpdateWithoutStrapInstallationsInputObjectSchema } from './WatchUpdateWithoutStrapInstallationsInput.schema';
import { WatchUncheckedUpdateWithoutStrapInstallationsInputObjectSchema as WatchUncheckedUpdateWithoutStrapInstallationsInputObjectSchema } from './WatchUncheckedUpdateWithoutStrapInstallationsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchCreateWithoutStrapInstallationsInputObjectSchema), z.lazy(() => WatchUncheckedCreateWithoutStrapInstallationsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WatchCreateOrConnectWithoutStrapInstallationsInputObjectSchema).optional(),
  upsert: z.lazy(() => WatchUpsertWithoutStrapInstallationsInputObjectSchema).optional(),
  connect: z.lazy(() => WatchWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => WatchUpdateToOneWithWhereWithoutStrapInstallationsInputObjectSchema), z.lazy(() => WatchUpdateWithoutStrapInstallationsInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutStrapInstallationsInputObjectSchema)]).optional()
}).strict();
export const WatchUpdateOneRequiredWithoutStrapInstallationsNestedInputObjectSchema: z.ZodType<Prisma.WatchUpdateOneRequiredWithoutStrapInstallationsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateOneRequiredWithoutStrapInstallationsNestedInput>;
export const WatchUpdateOneRequiredWithoutStrapInstallationsNestedInputObjectZodSchema = makeSchema();
