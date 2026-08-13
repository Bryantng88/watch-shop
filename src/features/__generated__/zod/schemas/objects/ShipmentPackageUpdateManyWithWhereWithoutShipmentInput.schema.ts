import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ShipmentPackageScalarWhereInputObjectSchema as ShipmentPackageScalarWhereInputObjectSchema } from './ShipmentPackageScalarWhereInput.schema';
import { ShipmentPackageUpdateManyMutationInputObjectSchema as ShipmentPackageUpdateManyMutationInputObjectSchema } from './ShipmentPackageUpdateManyMutationInput.schema';
import { ShipmentPackageUncheckedUpdateManyWithoutShipmentInputObjectSchema as ShipmentPackageUncheckedUpdateManyWithoutShipmentInputObjectSchema } from './ShipmentPackageUncheckedUpdateManyWithoutShipmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ShipmentPackageScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ShipmentPackageUpdateManyMutationInputObjectSchema), z.lazy(() => ShipmentPackageUncheckedUpdateManyWithoutShipmentInputObjectSchema)])
}).strict();
export const ShipmentPackageUpdateManyWithWhereWithoutShipmentInputObjectSchema: z.ZodType<Prisma.ShipmentPackageUpdateManyWithWhereWithoutShipmentInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentPackageUpdateManyWithWhereWithoutShipmentInput>;
export const ShipmentPackageUpdateManyWithWhereWithoutShipmentInputObjectZodSchema = makeSchema();
