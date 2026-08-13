import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierWebhookDeliveryCreateManyInputObjectSchema as CarrierWebhookDeliveryCreateManyInputObjectSchema } from './objects/CarrierWebhookDeliveryCreateManyInput.schema';

export const CarrierWebhookDeliveryCreateManySchema: z.ZodType<Prisma.CarrierWebhookDeliveryCreateManyArgs> = z.object({ data: z.union([ CarrierWebhookDeliveryCreateManyInputObjectSchema, z.array(CarrierWebhookDeliveryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryCreateManyArgs>;

export const CarrierWebhookDeliveryCreateManyZodSchema = z.object({ data: z.union([ CarrierWebhookDeliveryCreateManyInputObjectSchema, z.array(CarrierWebhookDeliveryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();