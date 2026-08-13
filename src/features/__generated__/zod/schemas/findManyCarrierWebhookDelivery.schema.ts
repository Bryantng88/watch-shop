import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierWebhookDeliveryOrderByWithRelationInputObjectSchema as CarrierWebhookDeliveryOrderByWithRelationInputObjectSchema } from './objects/CarrierWebhookDeliveryOrderByWithRelationInput.schema';
import { CarrierWebhookDeliveryWhereInputObjectSchema as CarrierWebhookDeliveryWhereInputObjectSchema } from './objects/CarrierWebhookDeliveryWhereInput.schema';
import { CarrierWebhookDeliveryWhereUniqueInputObjectSchema as CarrierWebhookDeliveryWhereUniqueInputObjectSchema } from './objects/CarrierWebhookDeliveryWhereUniqueInput.schema';
import { CarrierWebhookDeliveryScalarFieldEnumSchema } from './enums/CarrierWebhookDeliveryScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const CarrierWebhookDeliveryFindManySelectSchema: z.ZodType<Prisma.CarrierWebhookDeliverySelect> = z.object({
    id: z.boolean().optional(),
    carrierCode: z.boolean().optional(),
    environment: z.boolean().optional(),
    externalEventId: z.boolean().optional(),
    externalOrderCode: z.boolean().optional(),
    payloadHash: z.boolean().optional(),
    payloadJson: z.boolean().optional(),
    signatureValid: z.boolean().optional(),
    status: z.boolean().optional(),
    receivedAt: z.boolean().optional(),
    processedAt: z.boolean().optional(),
    errorMessage: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.CarrierWebhookDeliverySelect>;

export const CarrierWebhookDeliveryFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    carrierCode: z.boolean().optional(),
    environment: z.boolean().optional(),
    externalEventId: z.boolean().optional(),
    externalOrderCode: z.boolean().optional(),
    payloadHash: z.boolean().optional(),
    payloadJson: z.boolean().optional(),
    signatureValid: z.boolean().optional(),
    status: z.boolean().optional(),
    receivedAt: z.boolean().optional(),
    processedAt: z.boolean().optional(),
    errorMessage: z.boolean().optional()
  }).strict();

export const CarrierWebhookDeliveryFindManySchema: z.ZodType<Prisma.CarrierWebhookDeliveryFindManyArgs> = z.object({ select: CarrierWebhookDeliveryFindManySelectSchema.optional(),  orderBy: z.union([CarrierWebhookDeliveryOrderByWithRelationInputObjectSchema, CarrierWebhookDeliveryOrderByWithRelationInputObjectSchema.array()]).optional(), where: CarrierWebhookDeliveryWhereInputObjectSchema.optional(), cursor: CarrierWebhookDeliveryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CarrierWebhookDeliveryScalarFieldEnumSchema, CarrierWebhookDeliveryScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryFindManyArgs>;

export const CarrierWebhookDeliveryFindManyZodSchema = z.object({ select: CarrierWebhookDeliveryFindManySelectSchema.optional(),  orderBy: z.union([CarrierWebhookDeliveryOrderByWithRelationInputObjectSchema, CarrierWebhookDeliveryOrderByWithRelationInputObjectSchema.array()]).optional(), where: CarrierWebhookDeliveryWhereInputObjectSchema.optional(), cursor: CarrierWebhookDeliveryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CarrierWebhookDeliveryScalarFieldEnumSchema, CarrierWebhookDeliveryScalarFieldEnumSchema.array()]).optional() }).strict();