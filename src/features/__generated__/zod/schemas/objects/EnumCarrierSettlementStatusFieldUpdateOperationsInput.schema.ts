import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierSettlementStatusSchema } from '../enums/CarrierSettlementStatus.schema'

const makeSchema = () => z.object({
  set: CarrierSettlementStatusSchema.optional()
}).strict();
export const EnumCarrierSettlementStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumCarrierSettlementStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumCarrierSettlementStatusFieldUpdateOperationsInput>;
export const EnumCarrierSettlementStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
