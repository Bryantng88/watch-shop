import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentPackageWhereUniqueInputObjectSchema as ShipmentPackageWhereUniqueInputObjectSchema } from './ShipmentPackageWhereUniqueInput.schema';
import { ShipmentPackageUpdateWithoutShipmentInputObjectSchema as ShipmentPackageUpdateWithoutShipmentInputObjectSchema } from './ShipmentPackageUpdateWithoutShipmentInput.schema';
import { ShipmentPackageUncheckedUpdateWithoutShipmentInputObjectSchema as ShipmentPackageUncheckedUpdateWithoutShipmentInputObjectSchema } from './ShipmentPackageUncheckedUpdateWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentPackageWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ShipmentPackageUpdateWithoutShipmentInputObjectSchema), z.lazy(() => ShipmentPackageUncheckedUpdateWithoutShipmentInputObjectSchema)])
}).strict();
export const ShipmentPackageUpdateWithWhereUniqueWithoutShipmentInputObjectSchema: z.ZodType<Prisma.ShipmentPackageUpdateWithWhereUniqueWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentPackageUpdateWithWhereUniqueWithoutShipmentInput>;
export const ShipmentPackageUpdateWithWhereUniqueWithoutShipmentInputObjectZodSchema = makeSchema();
