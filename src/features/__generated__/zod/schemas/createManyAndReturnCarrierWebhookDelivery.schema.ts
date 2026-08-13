import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierWebhookDeliverySelectObjectSchema as CarrierWebhookDeliverySelectObjectSchema } from './objects/CarrierWebhookDeliverySelect.schema';
import { CarrierWebhookDeliveryCreateManyInputObjectSchema as CarrierWebhookDeliveryCreateManyInputObjectSchema } from './objects/CarrierWebhookDeliveryCreateManyInput.schema';

export const CarrierWebhookDeliveryCreateManyAndReturnSchema: z.ZodType<Prisma.CarrierWebhookDeliveryCreateManyAndReturnArgs> = z.object({ select: CarrierWebhookDeliverySelectObjectSchema.optional(), data: z.union([ CarrierWebhookDeliveryCreateManyInputObjectSchema, z.array(CarrierWebhookDeliveryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryCreateManyAndReturnArgs>;

export const CarrierWebhookDeliveryCreateManyAndReturnZodSchema = z.object({ select: CarrierWebhookDeliverySelectObjectSchema.optional(), data: z.union([ CarrierWebhookDeliveryCreateManyInputObjectSchema, z.array(CarrierWebhookDeliveryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();