import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierWebhookDeliveryWhereInputObjectSchema as CarrierWebhookDeliveryWhereInputObjectSchema } from './objects/CarrierWebhookDeliveryWhereInput.schema';

export const CarrierWebhookDeliveryDeleteManySchema: z.ZodType<Prisma.CarrierWebhookDeliveryDeleteManyArgs> = z.object({ where: CarrierWebhookDeliveryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryDeleteManyArgs>;

export const CarrierWebhookDeliveryDeleteManyZodSchema = z.object({ where: CarrierWebhookDeliveryWhereInputObjectSchema.optional() }).strict();