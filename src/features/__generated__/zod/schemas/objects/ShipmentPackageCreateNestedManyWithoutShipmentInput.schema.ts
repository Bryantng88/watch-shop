import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentPackageCreateWithoutShipmentInputObjectSchema as ShipmentPackageCreateWithoutShipmentInputObjectSchema } from './ShipmentPackageCreateWithoutShipmentInput.schema';
import { ShipmentPackageUncheckedCreateWithoutShipmentInputObjectSchema as ShipmentPackageUncheckedCreateWithoutShipmentInputObjectSchema } from './ShipmentPackageUncheckedCreateWithoutShipmentInput.schema';
import { ShipmentPackageCreateOrConnectWithoutShipmentInputObjectSchema as ShipmentPackageCreateOrConnectWithoutShipmentInputObjectSchema } from './ShipmentPackageCreateOrConnectWithoutShipmentInput.schema';
import { ShipmentPackageCreateManyShipmentInputEnvelopeObjectSchema as ShipmentPackageCreateManyShipmentInputEnvelopeObjectSchema } from './ShipmentPackageCreateManyShipmentInputEnvelope.schema';
import { ShipmentPackageWhereUniqueInputObjectSchema as ShipmentPackageWhereUniqueInputObjectSchema } from './ShipmentPackageWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ShipmentPackageCreateWithoutShipmentInputObjectSchema), z.lazy(() => ShipmentPackageCreateWithoutShipmentInputObjectSchema).array(), z.lazy(() => ShipmentPackageUncheckedCreateWithoutShipmentInputObjectSchema), z.lazy(() => ShipmentPackageUncheckedCreateWithoutShipmentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ShipmentPackageCreateOrConnectWithoutShipmentInputObjectSchema), z.lazy(() => ShipmentPackageCreateOrConnectWithoutShipmentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ShipmentPackageCreateManyShipmentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ShipmentPackageWhereUniqueInputObjectSchema), z.lazy(() => ShipmentPackageWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ShipmentPackageCreateNestedManyWithoutShipmentInputObjectSchema: z.ZodType<Prisma.ShipmentPackageCreateNestedManyWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentPackageCreateNestedManyWithoutShipmentInput>;
export const ShipmentPackageCreateNestedManyWithoutShipmentInputObjectZodSchema = makeSchema();
