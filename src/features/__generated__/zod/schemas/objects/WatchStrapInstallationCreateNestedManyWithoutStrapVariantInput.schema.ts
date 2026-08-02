import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapInstallationCreateWithoutStrapVariantInputObjectSchema as WatchStrapInstallationCreateWithoutStrapVariantInputObjectSchema } from './WatchStrapInstallationCreateWithoutStrapVariantInput.schema';
import { WatchStrapInstallationUncheckedCreateWithoutStrapVariantInputObjectSchema as WatchStrapInstallationUncheckedCreateWithoutStrapVariantInputObjectSchema } from './WatchStrapInstallationUncheckedCreateWithoutStrapVariantInput.schema';
import { WatchStrapInstallationCreateOrConnectWithoutStrapVariantInputObjectSchema as WatchStrapInstallationCreateOrConnectWithoutStrapVariantInputObjectSchema } from './WatchStrapInstallationCreateOrConnectWithoutStrapVariantInput.schema';
import { WatchStrapInstallationCreateManyStrapVariantInputEnvelopeObjectSchema as WatchStrapInstallationCreateManyStrapVariantInputEnvelopeObjectSchema } from './WatchStrapInstallationCreateManyStrapVariantInputEnvelope.schema';
import { WatchStrapInstallationWhereUniqueInputObjectSchema as WatchStrapInstallationWhereUniqueInputObjectSchema } from './WatchStrapInstallationWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchStrapInstallationCreateWithoutStrapVariantInputObjectSchema), z.lazy(() => WatchStrapInstallationCreateWithoutStrapVariantInputObjectSchema).array(), z.lazy(() => WatchStrapInstallationUncheckedCreateWithoutStrapVariantInputObjectSchema), z.lazy(() => WatchStrapInstallationUncheckedCreateWithoutStrapVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WatchStrapInstallationCreateOrConnectWithoutStrapVariantInputObjectSchema), z.lazy(() => WatchStrapInstallationCreateOrConnectWithoutStrapVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WatchStrapInstallationCreateManyStrapVariantInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema), z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const WatchStrapInstallationCreateNestedManyWithoutStrapVariantInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationCreateNestedManyWithoutStrapVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationCreateNestedManyWithoutStrapVariantInput>;
export const WatchStrapInstallationCreateNestedManyWithoutStrapVariantInputObjectZodSchema = makeSchema();
