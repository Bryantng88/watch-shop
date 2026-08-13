import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierChargeKindSchema } from '../enums/CarrierChargeKind.schema'

const makeSchema = () => z.object({
  shipmentId: z.string(),
  kind: CarrierChargeKindSchema
}).strict();
export const CarrierChargeShipmentIdKindCompoundUniqueInputObjectSchema: z.ZodType<Prisma.CarrierChargeShipmentIdKindCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeShipmentIdKindCompoundUniqueInput>;
export const CarrierChargeShipmentIdKindCompoundUniqueInputObjectZodSchema = makeSchema();
