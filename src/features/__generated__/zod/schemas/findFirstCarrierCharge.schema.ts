import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierChargeIncludeObjectSchema as CarrierChargeIncludeObjectSchema } from './objects/CarrierChargeInclude.schema';
import { CarrierChargeOrderByWithRelationInputObjectSchema as CarrierChargeOrderByWithRelationInputObjectSchema } from './objects/CarrierChargeOrderByWithRelationInput.schema';
import { CarrierChargeWhereInputObjectSchema as CarrierChargeWhereInputObjectSchema } from './objects/CarrierChargeWhereInput.schema';
import { CarrierChargeWhereUniqueInputObjectSchema as CarrierChargeWhereUniqueInputObjectSchema } from './objects/CarrierChargeWhereUniqueInput.schema';
import { CarrierChargeScalarFieldEnumSchema } from './enums/CarrierChargeScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const CarrierChargeFindFirstSelectSchema: z.ZodType<Prisma.CarrierChargeSelect> = z.object({
    id: z.boolean().optional(),
    shipmentId: z.boolean().optional(),
    kind: z.boolean().optional(),
    currency: z.boolean().optional(),
    estimatedAmount: z.boolean().optional(),
    chargedAmount: z.boolean().optional(),
    settlementStatus: z.boolean().optional(),
    settlementRef: z.boolean().optional(),
    settledAt: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    shipment: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.CarrierChargeSelect>;

export const CarrierChargeFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    shipmentId: z.boolean().optional(),
    kind: z.boolean().optional(),
    currency: z.boolean().optional(),
    estimatedAmount: z.boolean().optional(),
    chargedAmount: z.boolean().optional(),
    settlementStatus: z.boolean().optional(),
    settlementRef: z.boolean().optional(),
    settledAt: z.boolean().optional(),
    metadataJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    shipment: z.boolean().optional()
  }).strict();

export const CarrierChargeFindFirstSchema: z.ZodType<Prisma.CarrierChargeFindFirstArgs> = z.object({ select: CarrierChargeFindFirstSelectSchema.optional(), include: CarrierChargeIncludeObjectSchema.optional(), orderBy: z.union([CarrierChargeOrderByWithRelationInputObjectSchema, CarrierChargeOrderByWithRelationInputObjectSchema.array()]).optional(), where: CarrierChargeWhereInputObjectSchema.optional(), cursor: CarrierChargeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CarrierChargeScalarFieldEnumSchema, CarrierChargeScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.CarrierChargeFindFirstArgs>;

export const CarrierChargeFindFirstZodSchema = z.object({ select: CarrierChargeFindFirstSelectSchema.optional(), include: CarrierChargeIncludeObjectSchema.optional(), orderBy: z.union([CarrierChargeOrderByWithRelationInputObjectSchema, CarrierChargeOrderByWithRelationInputObjectSchema.array()]).optional(), where: CarrierChargeWhereInputObjectSchema.optional(), cursor: CarrierChargeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CarrierChargeScalarFieldEnumSchema, CarrierChargeScalarFieldEnumSchema.array()]).optional() }).strict();