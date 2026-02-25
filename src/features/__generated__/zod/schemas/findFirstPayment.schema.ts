import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PaymentIncludeObjectSchema as PaymentIncludeObjectSchema } from './objects/PaymentInclude.schema';
import { PaymentOrderByWithRelationInputObjectSchema as PaymentOrderByWithRelationInputObjectSchema } from './objects/PaymentOrderByWithRelationInput.schema';
import { PaymentWhereInputObjectSchema as PaymentWhereInputObjectSchema } from './objects/PaymentWhereInput.schema';
import { PaymentWhereUniqueInputObjectSchema as PaymentWhereUniqueInputObjectSchema } from './objects/PaymentWhereUniqueInput.schema';
import { PaymentScalarFieldEnumSchema } from './enums/PaymentScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const PaymentFindFirstSelectSchema: z.ZodType<Prisma.PaymentSelect> = z.object({
    id: z.boolean().optional(),
    method: z.boolean().optional(),
    amount: z.boolean().optional(),
    currency: z.boolean().optional(),
    paidAt: z.boolean().optional(),
    reference: z.boolean().optional(),
    note: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    direction: z.boolean().optional(),
    order_id: z.boolean().optional(),
    service_request_id: z.boolean().optional(),
    vendor_id: z.boolean().optional(),
    acquisition_id: z.boolean().optional(),
    status: z.boolean().optional(),
    purpose: z.boolean().optional(),
    shipment_id: z.boolean().optional(),
    type: z.boolean().optional(),
    MaintenanceRecord: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.PaymentSelect>;

export const PaymentFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    method: z.boolean().optional(),
    amount: z.boolean().optional(),
    currency: z.boolean().optional(),
    paidAt: z.boolean().optional(),
    reference: z.boolean().optional(),
    note: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    direction: z.boolean().optional(),
    order_id: z.boolean().optional(),
    service_request_id: z.boolean().optional(),
    vendor_id: z.boolean().optional(),
    acquisition_id: z.boolean().optional(),
    status: z.boolean().optional(),
    purpose: z.boolean().optional(),
    shipment_id: z.boolean().optional(),
    type: z.boolean().optional(),
    MaintenanceRecord: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const PaymentFindFirstSchema: z.ZodType<Prisma.PaymentFindFirstArgs> = z.object({ select: PaymentFindFirstSelectSchema.optional(), include: PaymentIncludeObjectSchema.optional(), orderBy: z.union([PaymentOrderByWithRelationInputObjectSchema, PaymentOrderByWithRelationInputObjectSchema.array()]).optional(), where: PaymentWhereInputObjectSchema.optional(), cursor: PaymentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PaymentScalarFieldEnumSchema, PaymentScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.PaymentFindFirstArgs>;

export const PaymentFindFirstZodSchema = z.object({ select: PaymentFindFirstSelectSchema.optional(), include: PaymentIncludeObjectSchema.optional(), orderBy: z.union([PaymentOrderByWithRelationInputObjectSchema, PaymentOrderByWithRelationInputObjectSchema.array()]).optional(), where: PaymentWhereInputObjectSchema.optional(), cursor: PaymentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PaymentScalarFieldEnumSchema, PaymentScalarFieldEnumSchema.array()]).optional() }).strict();