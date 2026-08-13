import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentPackageCreateWithoutShipmentInputObjectSchema as ShipmentPackageCreateWithoutShipmentInputObjectSchema } from './ShipmentPackageCreateWithoutShipmentInput.schema';
import { ShipmentPackageUncheckedCreateWithoutShipmentInputObjectSchema as ShipmentPackageUncheckedCreateWithoutShipmentInputObjectSchema } from './ShipmentPackageUncheckedCreateWithoutShipmentInput.schema';
import { ShipmentPackageCreateOrConnectWithoutShipmentInputObjectSchema as ShipmentPackageCreateOrConnectWithoutShipmentInputObjectSchema } from './ShipmentPackageCreateOrConnectWithoutShipmentInput.schema';
import { ShipmentPackageUpsertWithWhereUniqueWithoutShipmentInputObjectSchema as ShipmentPackageUpsertWithWhereUniqueWithoutShipmentInputObjectSchema } from './ShipmentPackageUpsertWithWhereUniqueWithoutShipmentInput.schema';
import { ShipmentPackageCreateManyShipmentInputEnvelopeObjectSchema as ShipmentPackageCreateManyShipmentInputEnvelopeObjectSchema } from './ShipmentPackageCreateManyShipmentInputEnvelope.schema';
import { ShipmentPackageWhereUniqueInputObjectSchema as ShipmentPackageWhereUniqueInputObjectSchema } from './ShipmentPackageWhereUniqueInput.schema';
import { ShipmentPackageUpdateWithWhereUniqueWithoutShipmentInputObjectSchema as ShipmentPackageUpdateWithWhereUniqueWithoutShipmentInputObjectSchema } from './ShipmentPackageUpdateWithWhereUniqueWithoutShipmentInput.schema';
import { ShipmentPackageUpdateManyWithWhereWithoutShipmentInputObjectSchema as ShipmentPackageUpdateManyWithWhereWithoutShipmentInputObjectSchema } from './ShipmentPackageUpdateManyWithWhereWithoutShipmentInput.schema';
import { ShipmentPackageScalarWhereInputObjectSchema as ShipmentPackageScalarWhereInputObjectSchema } from './ShipmentPackageScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ShipmentPackageCreateWithoutShipmentInputObjectSchema), z.lazy(() => ShipmentPackageCreateWithoutShipmentInputObjectSchema).array(), z.lazy(() => ShipmentPackageUncheckedCreateWithoutShipmentInputObjectSchema), z.lazy(() => ShipmentPackageUncheckedCreateWithoutShipmentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ShipmentPackageCreateOrConnectWithoutShipmentInputObjectSchema), z.lazy(() => ShipmentPackageCreateOrConnectWithoutShipmentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ShipmentPackageUpsertWithWhereUniqueWithoutShipmentInputObjectSchema), z.lazy(() => ShipmentPackageUpsertWithWhereUniqueWithoutShipmentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ShipmentPackageCreateManyShipmentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ShipmentPackageWhereUniqueInputObjectSchema), z.lazy(() => ShipmentPackageWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ShipmentPackageWhereUniqueInputObjectSchema), z.lazy(() => ShipmentPackageWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ShipmentPackageWhereUniqueInputObjectSchema), z.lazy(() => ShipmentPackageWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ShipmentPackageWhereUniqueInputObjectSchema), z.lazy(() => ShipmentPackageWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ShipmentPackageUpdateWithWhereUniqueWithoutShipmentInputObjectSchema), z.lazy(() => ShipmentPackageUpdateWithWhereUniqueWithoutShipmentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ShipmentPackageUpdateManyWithWhereWithoutShipmentInputObjectSchema), z.lazy(() => ShipmentPackageUpdateManyWithWhereWithoutShipmentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ShipmentPackageScalarWhereInputObjectSchema), z.lazy(() => ShipmentPackageScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ShipmentPackageUncheckedUpdateManyWithoutShipmentNestedInputObjectSchema: z.ZodType<Prisma.ShipmentPackageUncheckedUpdateManyWithoutShipmentNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentPackageUncheckedUpdateManyWithoutShipmentNestedInput>;
export const ShipmentPackageUncheckedUpdateManyWithoutShipmentNestedInputObjectZodSchema = makeSchema();
