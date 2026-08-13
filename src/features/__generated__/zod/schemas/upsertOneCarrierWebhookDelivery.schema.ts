import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierWebhookDeliverySelectObjectSchema as CarrierWebhookDeliverySelectObjectSchema } from './objects/CarrierWebhookDeliverySelect.schema';
import { CarrierWebhookDeliveryWhereUniqueInputObjectSchema as CarrierWebhookDeliveryWhereUniqueInputObjectSchema } from './objects/CarrierWebhookDeliveryWhereUniqueInput.schema';
import { CarrierWebhookDeliveryCreateInputObjectSchema as CarrierWebhookDeliveryCreateInputObjectSchema } from './objects/CarrierWebhookDeliveryCreateInput.schema';
import { CarrierWebhookDeliveryUncheckedCreateInputObjectSchema as CarrierWebhookDeliveryUncheckedCreateInputObjectSchema } from './objects/CarrierWebhookDeliveryUncheckedCreateInput.schema';
import { CarrierWebhookDeliveryUpdateInputObjectSchema as CarrierWebhookDeliveryUpdateInputObjectSchema } from './objects/CarrierWebhookDeliveryUpdateInput.schema';
import { CarrierWebhookDeliveryUncheckedUpdateInputObjectSchema as CarrierWebhookDeliveryUncheckedUpdateInputObjectSchema } from './objects/CarrierWebhookDeliveryUncheckedUpdateInput.schema';

export const CarrierWebhookDeliveryUpsertOneSchema: z.ZodType<Prisma.CarrierWebhookDeliveryUpsertArgs> = z.object({ select: CarrierWebhookDeliverySelectObjectSchema.optional(),  where: CarrierWebhookDeliveryWhereUniqueInputObjectSchema, create: z.union([ CarrierWebhookDeliveryCreateInputObjectSchema, CarrierWebhookDeliveryUncheckedCreateInputObjectSchema ]), update: z.union([ CarrierWebhookDeliveryUpdateInputObjectSchema, CarrierWebhookDeliveryUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryUpsertArgs>;

export const CarrierWebhookDeliveryUpsertOneZodSchema = z.object({ select: CarrierWebhookDeliverySelectObjectSchema.optional(),  where: CarrierWebhookDeliveryWhereUniqueInputObjectSchema, create: z.union([ CarrierWebhookDeliveryCreateInputObjectSchema, CarrierWebhookDeliveryUncheckedCreateInputObjectSchema ]), update: z.union([ CarrierWebhookDeliveryUpdateInputObjectSchema, CarrierWebhookDeliveryUncheckedUpdateInputObjectSchema ]) }).strict();