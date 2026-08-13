import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  shipmentId: z.string(),
  carrierCode: z.string(),
  externalStatus: z.string(),
  occurredAt: z.date()
}).strict();
export const CarrierStatusHistoryShipmentIdCarrierCodeExternalStatusOccurredAtCompoundUniqueInputObjectSchema: z.ZodType<Prisma.CarrierStatusHistoryShipmentIdCarrierCodeExternalStatusOccurredAtCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierStatusHistoryShipmentIdCarrierCodeExternalStatusOccurredAtCompoundUniqueInput>;
export const CarrierStatusHistoryShipmentIdCarrierCodeExternalStatusOccurredAtCompoundUniqueInputObjectZodSchema = makeSchema();
