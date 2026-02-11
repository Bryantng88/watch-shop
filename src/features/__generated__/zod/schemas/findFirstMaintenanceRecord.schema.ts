import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MaintenanceRecordIncludeObjectSchema as MaintenanceRecordIncludeObjectSchema } from './objects/MaintenanceRecordInclude.schema';
import { MaintenanceRecordOrderByWithRelationInputObjectSchema as MaintenanceRecordOrderByWithRelationInputObjectSchema } from './objects/MaintenanceRecordOrderByWithRelationInput.schema';
import { MaintenanceRecordWhereInputObjectSchema as MaintenanceRecordWhereInputObjectSchema } from './objects/MaintenanceRecordWhereInput.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './objects/MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordScalarFieldEnumSchema } from './enums/MaintenanceRecordScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const MaintenanceRecordFindFirstSelectSchema: z.ZodType<Prisma.MaintenanceRecordSelect> = z.object({
    id: z.boolean().optional(),
    type: z.boolean().optional(),
    billable: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    productId: z.boolean().optional(),
    variantId: z.boolean().optional(),
    brandSnapshot: z.boolean().optional(),
    modelSnapshot: z.boolean().optional(),
    refSnapshot: z.boolean().optional(),
    serialSnapshot: z.boolean().optional(),
    vendorId: z.boolean().optional(),
    servicedByName: z.boolean().optional(),
    vendorName: z.boolean().optional(),
    servicedAt: z.boolean().optional(),
    notes: z.boolean().optional(),
    totalCost: z.boolean().optional(),
    billed: z.boolean().optional(),
    invoiceId: z.boolean().optional(),
    revenueAmount: z.boolean().optional(),
    currency: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    parts: z.boolean().optional(),
    product: z.boolean().optional(),
    serviceRequest: z.boolean().optional(),
    variant: z.boolean().optional(),
    vendor: z.boolean().optional(),
    serviceDetail: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.MaintenanceRecordSelect>;

export const MaintenanceRecordFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    type: z.boolean().optional(),
    billable: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    productId: z.boolean().optional(),
    variantId: z.boolean().optional(),
    brandSnapshot: z.boolean().optional(),
    modelSnapshot: z.boolean().optional(),
    refSnapshot: z.boolean().optional(),
    serialSnapshot: z.boolean().optional(),
    vendorId: z.boolean().optional(),
    servicedByName: z.boolean().optional(),
    vendorName: z.boolean().optional(),
    servicedAt: z.boolean().optional(),
    notes: z.boolean().optional(),
    totalCost: z.boolean().optional(),
    billed: z.boolean().optional(),
    invoiceId: z.boolean().optional(),
    revenueAmount: z.boolean().optional(),
    currency: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    parts: z.boolean().optional(),
    product: z.boolean().optional(),
    serviceRequest: z.boolean().optional(),
    variant: z.boolean().optional(),
    vendor: z.boolean().optional(),
    serviceDetail: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const MaintenanceRecordFindFirstSchema: z.ZodType<Prisma.MaintenanceRecordFindFirstArgs> = z.object({ select: MaintenanceRecordFindFirstSelectSchema.optional(), include: MaintenanceRecordIncludeObjectSchema.optional(), orderBy: z.union([MaintenanceRecordOrderByWithRelationInputObjectSchema, MaintenanceRecordOrderByWithRelationInputObjectSchema.array()]).optional(), where: MaintenanceRecordWhereInputObjectSchema.optional(), cursor: MaintenanceRecordWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MaintenanceRecordScalarFieldEnumSchema, MaintenanceRecordScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.MaintenanceRecordFindFirstArgs>;

export const MaintenanceRecordFindFirstZodSchema = z.object({ select: MaintenanceRecordFindFirstSelectSchema.optional(), include: MaintenanceRecordIncludeObjectSchema.optional(), orderBy: z.union([MaintenanceRecordOrderByWithRelationInputObjectSchema, MaintenanceRecordOrderByWithRelationInputObjectSchema.array()]).optional(), where: MaintenanceRecordWhereInputObjectSchema.optional(), cursor: MaintenanceRecordWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MaintenanceRecordScalarFieldEnumSchema, MaintenanceRecordScalarFieldEnumSchema.array()]).optional() }).strict();