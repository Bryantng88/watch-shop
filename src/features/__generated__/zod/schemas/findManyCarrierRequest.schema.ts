import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierRequestIncludeObjectSchema as CarrierRequestIncludeObjectSchema } from './objects/CarrierRequestInclude.schema';
import { CarrierRequestOrderByWithRelationInputObjectSchema as CarrierRequestOrderByWithRelationInputObjectSchema } from './objects/CarrierRequestOrderByWithRelationInput.schema';
import { CarrierRequestWhereInputObjectSchema as CarrierRequestWhereInputObjectSchema } from './objects/CarrierRequestWhereInput.schema';
import { CarrierRequestWhereUniqueInputObjectSchema as CarrierRequestWhereUniqueInputObjectSchema } from './objects/CarrierRequestWhereUniqueInput.schema';
import { CarrierRequestScalarFieldEnumSchema } from './enums/CarrierRequestScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const CarrierRequestFindManySelectSchema: z.ZodType<Prisma.CarrierRequestSelect> = z.object({
    id: z.boolean().optional(),
    shipmentId: z.boolean().optional(),
    carrierCode: z.boolean().optional(),
    environment: z.boolean().optional(),
    operation: z.boolean().optional(),
    idempotencyKey: z.boolean().optional(),
    requestJson: z.boolean().optional(),
    responseJson: z.boolean().optional(),
    status: z.boolean().optional(),
    httpStatus: z.boolean().optional(),
    externalOrderCode: z.boolean().optional(),
    errorCode: z.boolean().optional(),
    errorMessage: z.boolean().optional(),
    attemptCount: z.boolean().optional(),
    requestedAt: z.boolean().optional(),
    completedAt: z.boolean().optional(),
    shipment: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.CarrierRequestSelect>;

export const CarrierRequestFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    shipmentId: z.boolean().optional(),
    carrierCode: z.boolean().optional(),
    environment: z.boolean().optional(),
    operation: z.boolean().optional(),
    idempotencyKey: z.boolean().optional(),
    requestJson: z.boolean().optional(),
    responseJson: z.boolean().optional(),
    status: z.boolean().optional(),
    httpStatus: z.boolean().optional(),
    externalOrderCode: z.boolean().optional(),
    errorCode: z.boolean().optional(),
    errorMessage: z.boolean().optional(),
    attemptCount: z.boolean().optional(),
    requestedAt: z.boolean().optional(),
    completedAt: z.boolean().optional(),
    shipment: z.boolean().optional()
  }).strict();

export const CarrierRequestFindManySchema: z.ZodType<Prisma.CarrierRequestFindManyArgs> = z.object({ select: CarrierRequestFindManySelectSchema.optional(), include: CarrierRequestIncludeObjectSchema.optional(), orderBy: z.union([CarrierRequestOrderByWithRelationInputObjectSchema, CarrierRequestOrderByWithRelationInputObjectSchema.array()]).optional(), where: CarrierRequestWhereInputObjectSchema.optional(), cursor: CarrierRequestWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CarrierRequestScalarFieldEnumSchema, CarrierRequestScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.CarrierRequestFindManyArgs>;

export const CarrierRequestFindManyZodSchema = z.object({ select: CarrierRequestFindManySelectSchema.optional(), include: CarrierRequestIncludeObjectSchema.optional(), orderBy: z.union([CarrierRequestOrderByWithRelationInputObjectSchema, CarrierRequestOrderByWithRelationInputObjectSchema.array()]).optional(), where: CarrierRequestWhereInputObjectSchema.optional(), cursor: CarrierRequestWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CarrierRequestScalarFieldEnumSchema, CarrierRequestScalarFieldEnumSchema.array()]).optional() }).strict();