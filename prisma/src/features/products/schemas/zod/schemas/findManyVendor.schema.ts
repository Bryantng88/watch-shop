import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { VendorIncludeObjectSchema as VendorIncludeObjectSchema } from './objects/VendorInclude.schema';
import { VendorOrderByWithRelationInputObjectSchema as VendorOrderByWithRelationInputObjectSchema } from './objects/VendorOrderByWithRelationInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './objects/VendorWhereInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './objects/VendorWhereUniqueInput.schema';
import { VendorScalarFieldEnumSchema } from './enums/VendorScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const VendorFindManySelectSchema: z.ZodType<Prisma.VendorSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    role: z.boolean().optional(),
    isAuthorized: z.boolean().optional(),
    email: z.boolean().optional(),
    phone: z.boolean().optional(),
    address: z.boolean().optional(),
    note: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    acquisitions: z.boolean().optional(),
    Invoice: z.boolean().optional(),
    services: z.boolean().optional(),
    Product: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.VendorSelect>;

export const VendorFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    role: z.boolean().optional(),
    isAuthorized: z.boolean().optional(),
    email: z.boolean().optional(),
    phone: z.boolean().optional(),
    address: z.boolean().optional(),
    note: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    acquisitions: z.boolean().optional(),
    Invoice: z.boolean().optional(),
    services: z.boolean().optional(),
    Product: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const VendorFindManySchema: z.ZodType<Prisma.VendorFindManyArgs> = z.object({ select: VendorFindManySelectSchema.optional(), include: VendorIncludeObjectSchema.optional(), orderBy: z.union([VendorOrderByWithRelationInputObjectSchema, VendorOrderByWithRelationInputObjectSchema.array()]).optional(), where: VendorWhereInputObjectSchema.optional(), cursor: VendorWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([VendorScalarFieldEnumSchema, VendorScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.VendorFindManyArgs>;

export const VendorFindManyZodSchema = z.object({ select: VendorFindManySelectSchema.optional(), include: VendorIncludeObjectSchema.optional(), orderBy: z.union([VendorOrderByWithRelationInputObjectSchema, VendorOrderByWithRelationInputObjectSchema.array()]).optional(), where: VendorWhereInputObjectSchema.optional(), cursor: VendorWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([VendorScalarFieldEnumSchema, VendorScalarFieldEnumSchema.array()]).optional() }).strict();