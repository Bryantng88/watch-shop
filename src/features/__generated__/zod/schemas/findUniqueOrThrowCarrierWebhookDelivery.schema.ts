import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierWebhookDeliverySelectObjectSchema as CarrierWebhookDeliverySelectObjectSchema } from './objects/CarrierWebhookDeliverySelect.schema';
import { CarrierWebhookDeliveryWhereUniqueInputObjectSchema as CarrierWebhookDeliveryWhereUniqueInputObjectSchema } from './objects/CarrierWebhookDeliveryWhereUniqueInput.schema';

export const CarrierWebhookDeliveryFindUniqueOrThrowSchema: z.ZodType<Prisma.CarrierWebhookDeliveryFindUniqueOrThrowArgs> = z.object({ select: CarrierWebhookDeliverySelectObjectSchema.optional(),  where: CarrierWebhookDeliveryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryFindUniqueOrThrowArgs>;

export const CarrierWebhookDeliveryFindUniqueOrThrowZodSchema = z.object({ select: CarrierWebhookDeliverySelectObjectSchema.optional(),  where: CarrierWebhookDeliveryWhereUniqueInputObjectSchema }).strict();