import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentPackageWhereUniqueInputObjectSchema as ShipmentPackageWhereUniqueInputObjectSchema } from './ShipmentPackageWhereUniqueInput.schema';
import { ShipmentPackageUpdateWithoutShipmentInputObjectSchema as ShipmentPackageUpdateWithoutShipmentInputObjectSchema } from './ShipmentPackageUpdateWithoutShipmentInput.schema';
import { ShipmentPackageUncheckedUpdateWithoutShipmentInputObjectSchema as ShipmentPackageUncheckedUpdateWithoutShipmentInputObjectSchema } from './ShipmentPackageUncheckedUpdateWithoutShipmentInput.schema';
import { ShipmentPackageCreateWithoutShipmentInputObjectSchema as ShipmentPackageCreateWithoutShipmentInputObjectSchema } from './ShipmentPackageCreateWithoutShipmentInput.schema';
import { ShipmentPackageUncheckedCreateWithoutShipmentInputObjectSchema as ShipmentPackageUncheckedCreateWithoutShipmentInputObjectSchema } from './ShipmentPackageUncheckedCreateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentPackageWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ShipmentPackageUpdateWithoutShipmentInputObjectSchema), z.lazy(() => ShipmentPackageUncheckedUpdateWithoutShipmentInputObjectSchema)]),
  create: z.union([z.lazy(() => ShipmentPackageCreateWithoutShipmentInputObjectSchema), z.lazy(() => ShipmentPackageUncheckedCreateWithoutShipmentInputObjectSchema)])
}).strict();
export const ShipmentPackageUpsertWithWhereUniqueWithoutShipmentInputObjectSchema: z.ZodType<Prisma.ShipmentPackageUpsertWithWhereUniqueWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentPackageUpsertWithWhereUniqueWithoutShipmentInput>;
export const ShipmentPackageUpsertWithWhereUniqueWithoutShipmentInputObjectZodSchema = makeSchema();
