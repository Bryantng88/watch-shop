import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierWebhookDeliverySelectObjectSchema as CarrierWebhookDeliverySelectObjectSchema } from './objects/CarrierWebhookDeliverySelect.schema';
import { CarrierWebhookDeliveryUpdateInputObjectSchema as CarrierWebhookDeliveryUpdateInputObjectSchema } from './objects/CarrierWebhookDeliveryUpdateInput.schema';
import { CarrierWebhookDeliveryUncheckedUpdateInputObjectSchema as CarrierWebhookDeliveryUncheckedUpdateInputObjectSchema } from './objects/CarrierWebhookDeliveryUncheckedUpdateInput.schema';
import { CarrierWebhookDeliveryWhereUniqueInputObjectSchema as CarrierWebhookDeliveryWhereUniqueInputObjectSchema } from './objects/CarrierWebhookDeliveryWhereUniqueInput.schema';

export const CarrierWebhookDeliveryUpdateOneSchema: z.ZodType<Prisma.CarrierWebhookDeliveryUpdateArgs> = z.object({ select: CarrierWebhookDeliverySelectObjectSchema.optional(),  data: z.union([CarrierWebhookDeliveryUpdateInputObjectSchema, CarrierWebhookDeliveryUncheckedUpdateInputObjectSchema]), where: CarrierWebhookDeliveryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryUpdateArgs>;

export const CarrierWebhookDeliveryUpdateOneZodSchema = z.object({ select: CarrierWebhookDeliverySelectObjectSchema.optional(),  data: z.union([CarrierWebhookDeliveryUpdateInputObjectSchema, CarrierWebhookDeliveryUncheckedUpdateInputObjectSchema]), where: CarrierWebhookDeliveryWhereUniqueInputObjectSchema }).strict();