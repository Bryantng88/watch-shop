import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierWebhookStatusSchema } from '../enums/CarrierWebhookStatus.schema'

const makeSchema = () => z.object({
  set: CarrierWebhookStatusSchema.optional()
}).strict();
export const EnumCarrierWebhookStatusFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumCarrierWebhookStatusFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumCarrierWebhookStatusFieldUpdateOperationsInput>;
export const EnumCarrierWebhookStatusFieldUpdateOperationsInputObjectZodSchema = makeSchema();
