import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceRequestIncludeObjectSchema as ServiceRequestIncludeObjectSchema } from './objects/ServiceRequestInclude.schema';
import { ServiceRequestOrderByWithRelationInputObjectSchema as ServiceRequestOrderByWithRelationInputObjectSchema } from './objects/ServiceRequestOrderByWithRelationInput.schema';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './objects/ServiceRequestWhereInput.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './objects/ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestScalarFieldEnumSchema } from './enums/ServiceRequestScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ServiceRequestFindFirstOrThrowSelectSchema: z.ZodType<Prisma.ServiceRequestSelect> = z.object({
    id: z.boolean().optional(),
    type: z.boolean().optional(),
    billable: z.boolean().optional(),
    orderItemId: z.boolean().optional(),
    customerId: z.boolean().optional(),
    productId: z.boolean().optional(),
    variantId: z.boolean().optional(),
    brandSnapshot: z.boolean().optional(),
    modelSnapshot: z.boolean().optional(),
    refSnapshot: z.boolean().optional(),
    serialSnapshot: z.boolean().optional(),
    appointmentAt: z.boolean().optional(),
    status: z.boolean().optional(),
    notes: z.boolean().optional(),
    warrantyUntil: z.boolean().optional(),
    warrantyPolicy: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    Invoice: z.boolean().optional(),
    maintenance: z.boolean().optional(),
    customer: z.boolean().optional(),
    orderItem: z.boolean().optional(),
    product: z.boolean().optional(),
    variant: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ServiceRequestSelect>;

export const ServiceRequestFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    type: z.boolean().optional(),
    billable: z.boolean().optional(),
    orderItemId: z.boolean().optional(),
    customerId: z.boolean().optional(),
    productId: z.boolean().optional(),
    variantId: z.boolean().optional(),
    brandSnapshot: z.boolean().optional(),
    modelSnapshot: z.boolean().optional(),
    refSnapshot: z.boolean().optional(),
    serialSnapshot: z.boolean().optional(),
    appointmentAt: z.boolean().optional(),
    status: z.boolean().optional(),
    notes: z.boolean().optional(),
    warrantyUntil: z.boolean().optional(),
    warrantyPolicy: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    Invoice: z.boolean().optional(),
    maintenance: z.boolean().optional(),
    customer: z.boolean().optional(),
    orderItem: z.boolean().optional(),
    product: z.boolean().optional(),
    variant: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const ServiceRequestFindFirstOrThrowSchema: z.ZodType<Prisma.ServiceRequestFindFirstOrThrowArgs> = z.object({ select: ServiceRequestFindFirstOrThrowSelectSchema.optional(), include: ServiceRequestIncludeObjectSchema.optional(), orderBy: z.union([ServiceRequestOrderByWithRelationInputObjectSchema, ServiceRequestOrderByWithRelationInputObjectSchema.array()]).optional(), where: ServiceRequestWhereInputObjectSchema.optional(), cursor: ServiceRequestWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ServiceRequestScalarFieldEnumSchema, ServiceRequestScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ServiceRequestFindFirstOrThrowArgs>;

export const ServiceRequestFindFirstOrThrowZodSchema = z.object({ select: ServiceRequestFindFirstOrThrowSelectSchema.optional(), include: ServiceRequestIncludeObjectSchema.optional(), orderBy: z.union([ServiceRequestOrderByWithRelationInputObjectSchema, ServiceRequestOrderByWithRelationInputObjectSchema.array()]).optional(), where: ServiceRequestWhereInputObjectSchema.optional(), cursor: ServiceRequestWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ServiceRequestScalarFieldEnumSchema, ServiceRequestScalarFieldEnumSchema.array()]).optional() }).strict();