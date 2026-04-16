import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentIncludeObjectSchema as ShipmentIncludeObjectSchema } from './objects/ShipmentInclude.schema';
import { ShipmentOrderByWithRelationInputObjectSchema as ShipmentOrderByWithRelationInputObjectSchema } from './objects/ShipmentOrderByWithRelationInput.schema';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './objects/ShipmentWhereInput.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './objects/ShipmentWhereUniqueInput.schema';
import { ShipmentScalarFieldEnumSchema } from './enums/ShipmentScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ShipmentFindFirstOrThrowSelectSchema: z.ZodType<Prisma.ShipmentSelect> = z.object({
    id: z.boolean().optional(),
    orderId: z.boolean().optional(),
    shipPhone: z.boolean().optional(),
    shipAddress: z.boolean().optional(),
    shipCity: z.boolean().optional(),
    shipDistrict: z.boolean().optional(),
    shipWard: z.boolean().optional(),
    carrier: z.boolean().optional(),
    trackingCode: z.boolean().optional(),
    shippingFee: z.boolean().optional(),
    currency: z.boolean().optional(),
    shippedAt: z.boolean().optional(),
    deliveredAt: z.boolean().optional(),
    notes: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    status: z.boolean().optional(),
    refNo: z.boolean().optional(),
    orderRefNo: z.boolean().optional(),
    customerName: z.boolean().optional(),
    Order: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ShipmentSelect>;

export const ShipmentFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    orderId: z.boolean().optional(),
    shipPhone: z.boolean().optional(),
    shipAddress: z.boolean().optional(),
    shipCity: z.boolean().optional(),
    shipDistrict: z.boolean().optional(),
    shipWard: z.boolean().optional(),
    carrier: z.boolean().optional(),
    trackingCode: z.boolean().optional(),
    shippingFee: z.boolean().optional(),
    currency: z.boolean().optional(),
    shippedAt: z.boolean().optional(),
    deliveredAt: z.boolean().optional(),
    notes: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    status: z.boolean().optional(),
    refNo: z.boolean().optional(),
    orderRefNo: z.boolean().optional(),
    customerName: z.boolean().optional(),
    Order: z.boolean().optional()
  }).strict();

export const ShipmentFindFirstOrThrowSchema: z.ZodType<Prisma.ShipmentFindFirstOrThrowArgs> = z.object({ select: ShipmentFindFirstOrThrowSelectSchema.optional(), include: ShipmentIncludeObjectSchema.optional(), orderBy: z.union([ShipmentOrderByWithRelationInputObjectSchema, ShipmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ShipmentWhereInputObjectSchema.optional(), cursor: ShipmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ShipmentScalarFieldEnumSchema, ShipmentScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ShipmentFindFirstOrThrowArgs>;

export const ShipmentFindFirstOrThrowZodSchema = z.object({ select: ShipmentFindFirstOrThrowSelectSchema.optional(), include: ShipmentIncludeObjectSchema.optional(), orderBy: z.union([ShipmentOrderByWithRelationInputObjectSchema, ShipmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ShipmentWhereInputObjectSchema.optional(), cursor: ShipmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ShipmentScalarFieldEnumSchema, ShipmentScalarFieldEnumSchema.array()]).optional() }).strict();