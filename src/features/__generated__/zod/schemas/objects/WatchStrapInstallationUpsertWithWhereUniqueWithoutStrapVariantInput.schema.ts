import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapInstallationWhereUniqueInputObjectSchema as WatchStrapInstallationWhereUniqueInputObjectSchema } from './WatchStrapInstallationWhereUniqueInput.schema';
import { WatchStrapInstallationUpdateWithoutStrapVariantInputObjectSchema as WatchStrapInstallationUpdateWithoutStrapVariantInputObjectSchema } from './WatchStrapInstallationUpdateWithoutStrapVariantInput.schema';
import { WatchStrapInstallationUncheckedUpdateWithoutStrapVariantInputObjectSchema as WatchStrapInstallationUncheckedUpdateWithoutStrapVariantInputObjectSchema } from './WatchStrapInstallationUncheckedUpdateWithoutStrapVariantInput.schema';
import { WatchStrapInstallationCreateWithoutStrapVariantInputObjectSchema as WatchStrapInstallationCreateWithoutStrapVariantInputObjectSchema } from './WatchStrapInstallationCreateWithoutStrapVariantInput.schema';
import { WatchStrapInstallationUncheckedCreateWithoutStrapVariantInputObjectSchema as WatchStrapInstallationUncheckedCreateWithoutStrapVariantInputObjectSchema } from './WatchStrapInstallationUncheckedCreateWithoutStrapVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => WatchStrapInstallationUpdateWithoutStrapVariantInputObjectSchema), z.lazy(() => WatchStrapInstallationUncheckedUpdateWithoutStrapVariantInputObjectSchema)]),
  create: z.union([z.lazy(() => WatchStrapInstallationCreateWithoutStrapVariantInputObjectSchema), z.lazy(() => WatchStrapInstallationUncheckedCreateWithoutStrapVariantInputObjectSchema)])
}).strict();
export const WatchStrapInstallationUpsertWithWhereUniqueWithoutStrapVariantInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationUpsertWithWhereUniqueWithoutStrapVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationUpsertWithWhereUniqueWithoutStrapVariantInput>;
export const WatchStrapInstallationUpsertWithWhereUniqueWithoutStrapVariantInputObjectZodSchema = makeSchema();
