import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapInstallationCreateWithoutStrapVariantInputObjectSchema as WatchStrapInstallationCreateWithoutStrapVariantInputObjectSchema } from './WatchStrapInstallationCreateWithoutStrapVariantInput.schema';
import { WatchStrapInstallationUncheckedCreateWithoutStrapVariantInputObjectSchema as WatchStrapInstallationUncheckedCreateWithoutStrapVariantInputObjectSchema } from './WatchStrapInstallationUncheckedCreateWithoutStrapVariantInput.schema';
import { WatchStrapInstallationCreateOrConnectWithoutStrapVariantInputObjectSchema as WatchStrapInstallationCreateOrConnectWithoutStrapVariantInputObjectSchema } from './WatchStrapInstallationCreateOrConnectWithoutStrapVariantInput.schema';
import { WatchStrapInstallationUpsertWithWhereUniqueWithoutStrapVariantInputObjectSchema as WatchStrapInstallationUpsertWithWhereUniqueWithoutStrapVariantInputObjectSchema } from './WatchStrapInstallationUpsertWithWhereUniqueWithoutStrapVariantInput.schema';
import { WatchStrapInstallationCreateManyStrapVariantInputEnvelopeObjectSchema as WatchStrapInstallationCreateManyStrapVariantInputEnvelopeObjectSchema } from './WatchStrapInstallationCreateManyStrapVariantInputEnvelope.schema';
import { WatchStrapInstallationWhereUniqueInputObjectSchema as WatchStrapInstallationWhereUniqueInputObjectSchema } from './WatchStrapInstallationWhereUniqueInput.schema';
import { WatchStrapInstallationUpdateWithWhereUniqueWithoutStrapVariantInputObjectSchema as WatchStrapInstallationUpdateWithWhereUniqueWithoutStrapVariantInputObjectSchema } from './WatchStrapInstallationUpdateWithWhereUniqueWithoutStrapVariantInput.schema';
import { WatchStrapInstallationUpdateManyWithWhereWithoutStrapVariantInputObjectSchema as WatchStrapInstallationUpdateManyWithWhereWithoutStrapVariantInputObjectSchema } from './WatchStrapInstallationUpdateManyWithWhereWithoutStrapVariantInput.schema';
import { WatchStrapInstallationScalarWhereInputObjectSchema as WatchStrapInstallationScalarWhereInputObjectSchema } from './WatchStrapInstallationScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WatchStrapInstallationCreateWithoutStrapVariantInputObjectSchema), z.lazy(() => WatchStrapInstallationCreateWithoutStrapVariantInputObjectSchema).array(), z.lazy(() => WatchStrapInstallationUncheckedCreateWithoutStrapVariantInputObjectSchema), z.lazy(() => WatchStrapInstallationUncheckedCreateWithoutStrapVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => WatchStrapInstallationCreateOrConnectWithoutStrapVariantInputObjectSchema), z.lazy(() => WatchStrapInstallationCreateOrConnectWithoutStrapVariantInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => WatchStrapInstallationUpsertWithWhereUniqueWithoutStrapVariantInputObjectSchema), z.lazy(() => WatchStrapInstallationUpsertWithWhereUniqueWithoutStrapVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => WatchStrapInstallationCreateManyStrapVariantInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema), z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema), z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema), z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema), z.lazy(() => WatchStrapInstallationWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => WatchStrapInstallationUpdateWithWhereUniqueWithoutStrapVariantInputObjectSchema), z.lazy(() => WatchStrapInstallationUpdateWithWhereUniqueWithoutStrapVariantInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => WatchStrapInstallationUpdateManyWithWhereWithoutStrapVariantInputObjectSchema), z.lazy(() => WatchStrapInstallationUpdateManyWithWhereWithoutStrapVariantInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => WatchStrapInstallationScalarWhereInputObjectSchema), z.lazy(() => WatchStrapInstallationScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const WatchStrapInstallationUncheckedUpdateManyWithoutStrapVariantNestedInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationUncheckedUpdateManyWithoutStrapVariantNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationUncheckedUpdateManyWithoutStrapVariantNestedInput>;
export const WatchStrapInstallationUncheckedUpdateManyWithoutStrapVariantNestedInputObjectZodSchema = makeSchema();
