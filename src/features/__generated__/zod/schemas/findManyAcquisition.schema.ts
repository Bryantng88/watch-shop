import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AcquisitionIncludeObjectSchema as AcquisitionIncludeObjectSchema } from './objects/AcquisitionInclude.schema';
import { AcquisitionOrderByWithRelationInputObjectSchema as AcquisitionOrderByWithRelationInputObjectSchema } from './objects/AcquisitionOrderByWithRelationInput.schema';
import { AcquisitionWhereInputObjectSchema as AcquisitionWhereInputObjectSchema } from './objects/AcquisitionWhereInput.schema';
import { AcquisitionWhereUniqueInputObjectSchema as AcquisitionWhereUniqueInputObjectSchema } from './objects/AcquisitionWhereUniqueInput.schema';
import { AcquisitionScalarFieldEnumSchema } from './enums/AcquisitionScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const AcquisitionFindManySelectSchema: z.ZodType<Prisma.AcquisitionSelect> = z.object({
    id: z.boolean().optional(),
    vendorId: z.boolean().optional(),
    customerId: z.boolean().optional(),
    type: z.boolean().optional(),
    acquiredAt: z.boolean().optional(),
    cost: z.boolean().optional(),
    currency: z.boolean().optional(),
    payoutStatus: z.boolean().optional(),
    accquisitionStt: z.boolean().optional(),
    refNo: z.boolean().optional(),
    notes: z.boolean().optional(),
    condition: z.boolean().optional(),
    warrantyUntil: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    sentAt: z.boolean().optional(),
    returnedAt: z.boolean().optional(),
    customer: z.boolean().optional(),
    vendor: z.boolean().optional(),
    acquisitionItem: z.boolean().optional(),
    invoice: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.AcquisitionSelect>;

export const AcquisitionFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    vendorId: z.boolean().optional(),
    customerId: z.boolean().optional(),
    type: z.boolean().optional(),
    acquiredAt: z.boolean().optional(),
    cost: z.boolean().optional(),
    currency: z.boolean().optional(),
    payoutStatus: z.boolean().optional(),
    accquisitionStt: z.boolean().optional(),
    refNo: z.boolean().optional(),
    notes: z.boolean().optional(),
    condition: z.boolean().optional(),
    warrantyUntil: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    sentAt: z.boolean().optional(),
    returnedAt: z.boolean().optional(),
    customer: z.boolean().optional(),
    vendor: z.boolean().optional(),
    acquisitionItem: z.boolean().optional(),
    invoice: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const AcquisitionFindManySchema: z.ZodType<Prisma.AcquisitionFindManyArgs> = z.object({ select: AcquisitionFindManySelectSchema.optional(), include: AcquisitionIncludeObjectSchema.optional(), orderBy: z.union([AcquisitionOrderByWithRelationInputObjectSchema, AcquisitionOrderByWithRelationInputObjectSchema.array()]).optional(), where: AcquisitionWhereInputObjectSchema.optional(), cursor: AcquisitionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AcquisitionScalarFieldEnumSchema, AcquisitionScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.AcquisitionFindManyArgs>;

export const AcquisitionFindManyZodSchema = z.object({ select: AcquisitionFindManySelectSchema.optional(), include: AcquisitionIncludeObjectSchema.optional(), orderBy: z.union([AcquisitionOrderByWithRelationInputObjectSchema, AcquisitionOrderByWithRelationInputObjectSchema.array()]).optional(), where: AcquisitionWhereInputObjectSchema.optional(), cursor: AcquisitionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AcquisitionScalarFieldEnumSchema, AcquisitionScalarFieldEnumSchema.array()]).optional() }).strict();