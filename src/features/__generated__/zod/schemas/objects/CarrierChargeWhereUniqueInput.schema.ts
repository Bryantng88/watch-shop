import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierChargeShipmentIdKindCompoundUniqueInputObjectSchema as CarrierChargeShipmentIdKindCompoundUniqueInputObjectSchema } from './CarrierChargeShipmentIdKindCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  shipmentId_kind: z.lazy(() => CarrierChargeShipmentIdKindCompoundUniqueInputObjectSchema).optional()
}).strict();
export const CarrierChargeWhereUniqueInputObjectSchema: z.ZodType<Prisma.CarrierChargeWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeWhereUniqueInput>;
export const CarrierChargeWhereUniqueInputObjectZodSchema = makeSchema();
