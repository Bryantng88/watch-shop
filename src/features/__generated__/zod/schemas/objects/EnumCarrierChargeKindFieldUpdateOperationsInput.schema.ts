import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierChargeKindSchema } from '../enums/CarrierChargeKind.schema'

const makeSchema = () => z.object({
  set: CarrierChargeKindSchema.optional()
}).strict();
export const EnumCarrierChargeKindFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumCarrierChargeKindFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumCarrierChargeKindFieldUpdateOperationsInput>;
export const EnumCarrierChargeKindFieldUpdateOperationsInputObjectZodSchema = makeSchema();
