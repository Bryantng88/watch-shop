import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierStatusHistoryShipmentIdCarrierCodeExternalStatusOccurredAtCompoundUniqueInputObjectSchema as CarrierStatusHistoryShipmentIdCarrierCodeExternalStatusOccurredAtCompoundUniqueInputObjectSchema } from './CarrierStatusHistoryShipmentIdCarrierCodeExternalStatusOccurredAtCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  shipmentId_carrierCode_externalStatus_occurredAt: z.lazy(() => CarrierStatusHistoryShipmentIdCarrierCodeExternalStatusOccurredAtCompoundUniqueInputObjectSchema).optional()
}).strict();
export const CarrierStatusHistoryWhereUniqueInputObjectSchema: z.ZodType<Prisma.CarrierStatusHistoryWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierStatusHistoryWhereUniqueInput>;
export const CarrierStatusHistoryWhereUniqueInputObjectZodSchema = makeSchema();
