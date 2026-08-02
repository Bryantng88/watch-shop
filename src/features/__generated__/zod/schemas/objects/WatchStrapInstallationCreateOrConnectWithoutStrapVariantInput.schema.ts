import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapInstallationWhereUniqueInputObjectSchema as WatchStrapInstallationWhereUniqueInputObjectSchema } from './WatchStrapInstallationWhereUniqueInput.schema';
import { WatchStrapInstallationCreateWithoutStrapVariantInputObjectSchema as WatchStrapInstallationCreateWithoutStrapVariantInputObjectSchema } from './WatchStrapInstallationCreateWithoutStrapVariantInput.schema';
import { WatchStrapInstallationUncheckedCreateWithoutStrapVariantInputObjectSchema as WatchStrapInstallationUncheckedCreateWithoutStrapVariantInputObjectSchema } from './WatchStrapInstallationUncheckedCreateWithoutStrapVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WatchStrapInstallationCreateWithoutStrapVariantInputObjectSchema), z.lazy(() => WatchStrapInstallationUncheckedCreateWithoutStrapVariantInputObjectSchema)])
}).strict();
export const WatchStrapInstallationCreateOrConnectWithoutStrapVariantInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationCreateOrConnectWithoutStrapVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationCreateOrConnectWithoutStrapVariantInput>;
export const WatchStrapInstallationCreateOrConnectWithoutStrapVariantInputObjectZodSchema = makeSchema();
