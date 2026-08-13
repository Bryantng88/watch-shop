import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierRequestStatusSchema } from '../enums/CarrierRequestStatus.schema'

const makeSchema = () => z.object({
  set: CarrierRequestStatusSchema.optional()
}).strict();
export const EnumCarrierRequestStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumCarrierRequestStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumCarrierRequestStatusFieldUpdateOperationsInput>;
export const EnumCarrierRequestStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
