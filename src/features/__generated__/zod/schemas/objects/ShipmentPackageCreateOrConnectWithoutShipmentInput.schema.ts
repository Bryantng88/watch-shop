import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentPackageWhereUniqueInputObjectSchema as ShipmentPackageWhereUniqueInputObjectSchema } from './ShipmentPackageWhereUniqueInput.schema';
import { ShipmentPackageCreateWithoutShipmentInputObjectSchema as ShipmentPackageCreateWithoutShipmentInputObjectSchema } from './ShipmentPackageCreateWithoutShipmentInput.schema';
import { ShipmentPackageUncheckedCreateWithoutShipmentInputObjectSchema as ShipmentPackageUncheckedCreateWithoutShipmentInputObjectSchema } from './ShipmentPackageUncheckedCreateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentPackageWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ShipmentPackageCreateWithoutShipmentInputObjectSchema), z.lazy(() => ShipmentPackageUncheckedCreateWithoutShipmentInputObjectSchema)])
}).strict();
export const ShipmentPackageCreateOrConnectWithoutShipmentInputObjectSchema: z.ZodType<Prisma.ShipmentPackageCreateOrConnectWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentPackageCreateOrConnectWithoutShipmentInput>;
export const ShipmentPackageCreateOrConnectWithoutShipmentInputObjectZodSchema = makeSchema();
