import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierWebhookDeliverySelectObjectSchema as CarrierWebhookDeliverySelectObjectSchema } from './objects/CarrierWebhookDeliverySelect.schema';
import { CarrierWebhookDeliveryUpdateManyMutationInputObjectSchema as CarrierWebhookDeliveryUpdateManyMutationInputObjectSchema } from './objects/CarrierWebhookDeliveryUpdateManyMutationInput.schema';
import { CarrierWebhookDeliveryWhereInputObjectSchema as CarrierWebhookDeliveryWhereInputObjectSchema } from './objects/CarrierWebhookDeliveryWhereInput.schema';

export const CarrierWebhookDeliveryUpdateManyAndReturnSchema: z.ZodType<Prisma.CarrierWebhookDeliveryUpdateManyAndReturnArgs> = z.object({ select: CarrierWebhookDeliverySelectObjectSchema.optional(), data: CarrierWebhookDeliveryUpdateManyMutationInputObjectSchema, where: CarrierWebhookDeliveryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryUpdateManyAndReturnArgs>;

export const CarrierWebhookDeliveryUpdateManyAndReturnZodSchema = z.object({ select: CarrierWebhookDeliverySelectObjectSchema.optional(), data: CarrierWebhookDeliveryUpdateManyMutationInputObjectSchema, where: CarrierWebhookDeliveryWhereInputObjectSchema.optional() }).strict();