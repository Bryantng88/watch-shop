import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema';
import { WatchUpdateWithoutStrapInstallationsInputObjectSchema as WatchUpdateWithoutStrapInstallationsInputObjectSchema } from './WatchUpdateWithoutStrapInstallationsInput.schema';
import { WatchUncheckedUpdateWithoutStrapInstallationsInputObjectSchema as WatchUncheckedUpdateWithoutStrapInstallationsInputObjectSchema } from './WatchUncheckedUpdateWithoutStrapInstallationsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WatchUpdateWithoutStrapInstallationsInputObjectSchema), z.lazy(() => WatchUncheckedUpdateWithoutStrapInstallationsInputObjectSchema)])
}).strict();
export const WatchUpdateToOneWithWhereWithoutStrapInstallationsInputObjectSchema: z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutStrapInstallationsInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchUpdateToOneWithWhereWithoutStrapInstallationsInput>;
export const WatchUpdateToOneWithWhereWithoutStrapInstallationsInputObjectZodSchema = makeSchema();
