import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { InvoiceIncludeObjectSchema as InvoiceIncludeObjectSchema } from './objects/InvoiceInclude.schema';
import { InvoiceOrderByWithRelationInputObjectSchema as InvoiceOrderByWithRelationInputObjectSchema } from './objects/InvoiceOrderByWithRelationInput.schema';
import { InvoiceWhereInputObjectSchema as InvoiceWhereInputObjectSchema } from './objects/InvoiceWhereInput.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './objects/InvoiceWhereUniqueInput.schema';
import { InvoiceScalarFieldEnumSchema } from './enums/InvoiceScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const InvoiceFindFirstSelectSchema: z.ZodType<Prisma.InvoiceSelect> = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    type: z.boolean().optional(),
    status: z.boolean().optional(),
    customerId: z.boolean().optional(),
    vendorId: z.boolean().optional(),
    orderId: z.boolean().optional(),
    acquisitionId: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    currency: z.boolean().optional(),
    subTotal: z.boolean().optional(),
    taxTotal: z.boolean().optional(),
    discountTotal: z.boolean().optional(),
    grandTotal: z.boolean().optional(),
    issuedAt: z.boolean().optional(),
    dueAt: z.boolean().optional(),
    notes: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    acquisition: z.boolean().optional(),
    customer: z.boolean().optional(),
    order: z.boolean().optional(),
    serviceReq: z.boolean().optional(),
    vendor: z.boolean().optional(),
    items: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.InvoiceSelect>;

export const InvoiceFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    type: z.boolean().optional(),
    status: z.boolean().optional(),
    customerId: z.boolean().optional(),
    vendorId: z.boolean().optional(),
    orderId: z.boolean().optional(),
    acquisitionId: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    currency: z.boolean().optional(),
    subTotal: z.boolean().optional(),
    taxTotal: z.boolean().optional(),
    discountTotal: z.boolean().optional(),
    grandTotal: z.boolean().optional(),
    issuedAt: z.boolean().optional(),
    dueAt: z.boolean().optional(),
    notes: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    acquisition: z.boolean().optional(),
    customer: z.boolean().optional(),
    order: z.boolean().optional(),
    serviceReq: z.boolean().optional(),
    vendor: z.boolean().optional(),
    items: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const InvoiceFindFirstSchema: z.ZodType<Prisma.InvoiceFindFirstArgs> = z.object({ select: InvoiceFindFirstSelectSchema.optional(), include: InvoiceIncludeObjectSchema.optional(), orderBy: z.union([InvoiceOrderByWithRelationInputObjectSchema, InvoiceOrderByWithRelationInputObjectSchema.array()]).optional(), where: InvoiceWhereInputObjectSchema.optional(), cursor: InvoiceWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([InvoiceScalarFieldEnumSchema, InvoiceScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.InvoiceFindFirstArgs>;

export const InvoiceFindFirstZodSchema = z.object({ select: InvoiceFindFirstSelectSchema.optional(), include: InvoiceIncludeObjectSchema.optional(), orderBy: z.union([InvoiceOrderByWithRelationInputObjectSchema, InvoiceOrderByWithRelationInputObjectSchema.array()]).optional(), where: InvoiceWhereInputObjectSchema.optional(), cursor: InvoiceWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([InvoiceScalarFieldEnumSchema, InvoiceScalarFieldEnumSchema.array()]).optional() }).strict();