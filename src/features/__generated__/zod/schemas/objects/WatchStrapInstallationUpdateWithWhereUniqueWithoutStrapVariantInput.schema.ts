import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapInstallationWhereUniqueInputObjectSchema as WatchStrapInstallationWhereUniqueInputObjectSchema } from './WatchStrapInstallationWhereUniqueInput.schema';
import { WatchStrapInstallationUpdateWithoutStrapVariantInputObjectSchema as WatchStrapInstallationUpdateWithoutStrapVariantInputObjectSchema } from './WatchStrapInstallationUpdateWithoutStrapVariantInput.schema';
import { WatchStrapInstallationUncheckedUpdateWithoutStrapVariantInputObjectSchema as WatchStrapInstallationUncheckedUpdateWithoutStrapVariantInputObjectSchema } from './WatchStrapInstallationUncheckedUpdateWithoutStrapVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => WatchStrapInstallationUpdateWithoutStrapVariantInputObjectSchema), z.lazy(() => WatchStrapInstallationUncheckedUpdateWithoutStrapVariantInputObjectSchema)])
}).strict();
export const WatchStrapInstallationUpdateWithWhereUniqueWithoutStrapVariantInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationUpdateWithWhereUniqueWithoutStrapVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationUpdateWithWhereUniqueWithoutStrapVariantInput>;
export const WatchStrapInstallationUpdateWithWhereUniqueWithoutStrapVariantInputObjectZodSchema = makeSchema();
