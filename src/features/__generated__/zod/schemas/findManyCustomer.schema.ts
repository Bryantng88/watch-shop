import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CustomerIncludeObjectSchema as CustomerIncludeObjectSchema } from './objects/CustomerInclude.schema';
import { CustomerOrderByWithRelationInputObjectSchema as CustomerOrderByWithRelationInputObjectSchema } from './objects/CustomerOrderByWithRelationInput.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './objects/CustomerWhereInput.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './objects/CustomerWhereUniqueInput.schema';
import { CustomerScalarFieldEnumSchema } from './enums/CustomerScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const CustomerFindManySelectSchema: z.ZodType<Prisma.CustomerSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    email: z.boolean().optional(),
    phone: z.boolean().optional(),
    ward: z.boolean().optional(),
    city: z.boolean().optional(),
    userId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    address: z.boolean().optional(),
<<<<<<< HEAD
=======
    district: z.boolean().optional(),
>>>>>>> 4f6d70506e71757ff795315d849e6d5ac7fcf052
    Acquisition: z.boolean().optional(),
    user: z.boolean().optional(),
    Invoice: z.boolean().optional(),
    orders: z.boolean().optional(),
    ServiceRequest: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.CustomerSelect>;

export const CustomerFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    email: z.boolean().optional(),
    phone: z.boolean().optional(),
    ward: z.boolean().optional(),
    city: z.boolean().optional(),
    userId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    address: z.boolean().optional(),
<<<<<<< HEAD
=======
    district: z.boolean().optional(),
>>>>>>> 4f6d70506e71757ff795315d849e6d5ac7fcf052
    Acquisition: z.boolean().optional(),
    user: z.boolean().optional(),
    Invoice: z.boolean().optional(),
    orders: z.boolean().optional(),
    ServiceRequest: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const CustomerFindManySchema: z.ZodType<Prisma.CustomerFindManyArgs> = z.object({ select: CustomerFindManySelectSchema.optional(), include: CustomerIncludeObjectSchema.optional(), orderBy: z.union([CustomerOrderByWithRelationInputObjectSchema, CustomerOrderByWithRelationInputObjectSchema.array()]).optional(), where: CustomerWhereInputObjectSchema.optional(), cursor: CustomerWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CustomerScalarFieldEnumSchema, CustomerScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.CustomerFindManyArgs>;

export const CustomerFindManyZodSchema = z.object({ select: CustomerFindManySelectSchema.optional(), include: CustomerIncludeObjectSchema.optional(), orderBy: z.union([CustomerOrderByWithRelationInputObjectSchema, CustomerOrderByWithRelationInputObjectSchema.array()]).optional(), where: CustomerWhereInputObjectSchema.optional(), cursor: CustomerWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CustomerScalarFieldEnumSchema, CustomerScalarFieldEnumSchema.array()]).optional() }).strict();