import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierStatusHistoryIncludeObjectSchema as CarrierStatusHistoryIncludeObjectSchema } from './objects/CarrierStatusHistoryInclude.schema';
import { CarrierStatusHistoryOrderByWithRelationInputObjectSchema as CarrierStatusHistoryOrderByWithRelationInputObjectSchema } from './objects/CarrierStatusHistoryOrderByWithRelationInput.schema';
import { CarrierStatusHistoryWhereInputObjectSchema as CarrierStatusHistoryWhereInputObjectSchema } from './objects/CarrierStatusHistoryWhereInput.schema';
import { CarrierStatusHistoryWhereUniqueInputObjectSchema as CarrierStatusHistoryWhereUniqueInputObjectSchema } from './objects/CarrierStatusHistoryWhereUniqueInput.schema';
import { CarrierStatusHistoryScalarFieldEnumSchema } from './enums/CarrierStatusHistoryScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const CarrierStatusHistoryFindFirstOrThrowSelectSchema: z.ZodType<Prisma.CarrierStatusHistorySelect> = z.object({
    id: z.boolean().optional(),
    shipmentId: z.boolean().optional(),
    carrierCode: z.boolean().optional(),
    externalStatus: z.boolean().optional(),
    normalizedStatus: z.boolean().optional(),
    description: z.boolean().optional(),
    location: z.boolean().optional(),
    occurredAt: z.boolean().optional(),
    payloadJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    shipment: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.CarrierStatusHistorySelect>;

export const CarrierStatusHistoryFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    shipmentId: z.boolean().optional(),
    carrierCode: z.boolean().optional(),
    externalStatus: z.boolean().optional(),
    normalizedStatus: z.boolean().optional(),
    description: z.boolean().optional(),
    location: z.boolean().optional(),
    occurredAt: z.boolean().optional(),
    payloadJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    shipment: z.boolean().optional()
  }).strict();

export const CarrierStatusHistoryFindFirstOrThrowSchema: z.ZodType<Prisma.CarrierStatusHistoryFindFirstOrThrowArgs> = z.object({ select: CarrierStatusHistoryFindFirstOrThrowSelectSchema.optional(), include: CarrierStatusHistoryIncludeObjectSchema.optional(), orderBy: z.union([CarrierStatusHistoryOrderByWithRelationInputObjectSchema, CarrierStatusHistoryOrderByWithRelationInputObjectSchema.array()]).optional(), where: CarrierStatusHistoryWhereInputObjectSchema.optional(), cursor: CarrierStatusHistoryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CarrierStatusHistoryScalarFieldEnumSchema, CarrierStatusHistoryScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.CarrierStatusHistoryFindFirstOrThrowArgs>;

export const CarrierStatusHistoryFindFirstOrThrowZodSchema = z.object({ select: CarrierStatusHistoryFindFirstOrThrowSelectSchema.optional(), include: CarrierStatusHistoryIncludeObjectSchema.optional(), orderBy: z.union([CarrierStatusHistoryOrderByWithRelationInputObjectSchema, CarrierStatusHistoryOrderByWithRelationInputObjectSchema.array()]).optional(), where: CarrierStatusHistoryWhereInputObjectSchema.optional(), cursor: CarrierStatusHistoryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CarrierStatusHistoryScalarFieldEnumSchema, CarrierStatusHistoryScalarFieldEnumSchema.array()]).optional() }).strict();