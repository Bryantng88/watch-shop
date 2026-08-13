import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierWebhookDeliveryUpdateManyMutationInputObjectSchema as CarrierWebhookDeliveryUpdateManyMutationInputObjectSchema } from './objects/CarrierWebhookDeliveryUpdateManyMutationInput.schema';
import { CarrierWebhookDeliveryWhereInputObjectSchema as CarrierWebhookDeliveryWhereInputObjectSchema } from './objects/CarrierWebhookDeliveryWhereInput.schema';

export const CarrierWebhookDeliveryUpdateManySchema: z.ZodType<Prisma.CarrierWebhookDeliveryUpdateManyArgs> = z.object({ data: CarrierWebhookDeliveryUpdateManyMutationInputObjectSchema, where: CarrierWebhookDeliveryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryUpdateManyArgs>;

export const CarrierWebhookDeliveryUpdateManyZodSchema = z.object({ data: CarrierWebhookDeliveryUpdateManyMutationInputObjectSchema, where: CarrierWebhookDeliveryWhereInputObjectSchema.optional() }).strict();