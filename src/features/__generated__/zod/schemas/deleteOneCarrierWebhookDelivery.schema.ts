import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierWebhookDeliverySelectObjectSchema as CarrierWebhookDeliverySelectObjectSchema } from './objects/CarrierWebhookDeliverySelect.schema';
import { CarrierWebhookDeliveryWhereUniqueInputObjectSchema as CarrierWebhookDeliveryWhereUniqueInputObjectSchema } from './objects/CarrierWebhookDeliveryWhereUniqueInput.schema';

export const CarrierWebhookDeliveryDeleteOneSchema: z.ZodType<Prisma.CarrierWebhookDeliveryDeleteArgs> = z.object({ select: CarrierWebhookDeliverySelectObjectSchema.optional(),  where: CarrierWebhookDeliveryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryDeleteArgs>;

export const CarrierWebhookDeliveryDeleteOneZodSchema = z.object({ select: CarrierWebhookDeliverySelectObjectSchema.optional(),  where: CarrierWebhookDeliveryWhereUniqueInputObjectSchema }).strict();