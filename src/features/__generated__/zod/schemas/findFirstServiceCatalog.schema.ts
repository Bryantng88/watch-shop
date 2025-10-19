import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ServiceCatalogIncludeObjectSchema as ServiceCatalogIncludeObjectSchema } from './objects/ServiceCatalogInclude.schema';
import { ServiceCatalogOrderByWithRelationInputObjectSchema as ServiceCatalogOrderByWithRelationInputObjectSchema } from './objects/ServiceCatalogOrderByWithRelationInput.schema';
import { ServiceCatalogWhereInputObjectSchema as ServiceCatalogWhereInputObjectSchema } from './objects/ServiceCatalogWhereInput.schema';
import { ServiceCatalogWhereUniqueInputObjectSchema as ServiceCatalogWhereUniqueInputObjectSchema } from './objects/ServiceCatalogWhereUniqueInput.schema';
import { ServiceCatalogScalarFieldEnumSchema } from './enums/ServiceCatalogScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ServiceCatalogFindFirstSelectSchema: z.ZodType<Prisma.ServiceCatalogSelect> = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    defaultPrice: z.boolean().optional(),
    durationMin: z.boolean().optional(),
    isActive: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    maintenanceRecordId: z.boolean().optional(),
    MaintenanceRecord: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ServiceCatalogSelect>;

export const ServiceCatalogFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    defaultPrice: z.boolean().optional(),
    durationMin: z.boolean().optional(),
    isActive: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    maintenanceRecordId: z.boolean().optional(),
    MaintenanceRecord: z.boolean().optional()
  }).strict();

export const ServiceCatalogFindFirstSchema: z.ZodType<Prisma.ServiceCatalogFindFirstArgs> = z.object({ select: ServiceCatalogFindFirstSelectSchema.optional(), include: ServiceCatalogIncludeObjectSchema.optional(), orderBy: z.union([ServiceCatalogOrderByWithRelationInputObjectSchema, ServiceCatalogOrderByWithRelationInputObjectSchema.array()]).optional(), where: ServiceCatalogWhereInputObjectSchema.optional(), cursor: ServiceCatalogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ServiceCatalogScalarFieldEnumSchema, ServiceCatalogScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ServiceCatalogFindFirstArgs>;

export const ServiceCatalogFindFirstZodSchema = z.object({ select: ServiceCatalogFindFirstSelectSchema.optional(), include: ServiceCatalogIncludeObjectSchema.optional(), orderBy: z.union([ServiceCatalogOrderByWithRelationInputObjectSchema, ServiceCatalogOrderByWithRelationInputObjectSchema.array()]).optional(), where: ServiceCatalogWhereInputObjectSchema.optional(), cursor: ServiceCatalogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ServiceCatalogScalarFieldEnumSchema, ServiceCatalogScalarFieldEnumSchema.array()]).optional() }).strict();