import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalIssueIncludeObjectSchema as TechnicalIssueIncludeObjectSchema } from './objects/TechnicalIssueInclude.schema';
import { TechnicalIssueOrderByWithRelationInputObjectSchema as TechnicalIssueOrderByWithRelationInputObjectSchema } from './objects/TechnicalIssueOrderByWithRelationInput.schema';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './objects/TechnicalIssueWhereInput.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './objects/TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueScalarFieldEnumSchema } from './enums/TechnicalIssueScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TechnicalIssueFindFirstSelectSchema: z.ZodType<Prisma.TechnicalIssueSelect> = z.object({
    id: z.boolean().optional(),
    assessmentId: z.boolean().optional(),
    area: z.boolean().optional(),
    issueType: z.boolean().optional(),
    actionMode: z.boolean().optional(),
    serviceCatalogId: z.boolean().optional(),
    supplyCatalogId: z.boolean().optional(),
    note: z.boolean().optional(),
    estimatedCost: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    vendorId: z.boolean().optional(),
    vendorNameSnap: z.boolean().optional(),
    mechanicalPartCatalogId: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    executionStatus: z.boolean().optional(),
    openedAt: z.boolean().optional(),
    startedAt: z.boolean().optional(),
    completedAt: z.boolean().optional(),
    canceledAt: z.boolean().optional(),
    actualCost: z.boolean().optional(),
    technicianId: z.boolean().optional(),
    summary: z.boolean().optional(),
    resolutionNote: z.boolean().optional(),
    completedByNameSnap: z.boolean().optional(),
    isConfirmed: z.boolean().optional(),
    confirmedAt: z.boolean().optional(),
    confirmedById: z.boolean().optional(),
    confirmedByNameSnap: z.boolean().optional(),
    MaintenanceRecord: z.boolean().optional(),
    TechnicalAssessment: z.boolean().optional(),
    MechanicalPartCatalog: z.boolean().optional(),
    ServiceCatalog: z.boolean().optional(),
    ServiceRequest: z.boolean().optional(),
    SupplyCatalog: z.boolean().optional(),
    User: z.boolean().optional(),
    Vendor: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.TechnicalIssueSelect>;

export const TechnicalIssueFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    assessmentId: z.boolean().optional(),
    area: z.boolean().optional(),
    issueType: z.boolean().optional(),
    actionMode: z.boolean().optional(),
    serviceCatalogId: z.boolean().optional(),
    supplyCatalogId: z.boolean().optional(),
    note: z.boolean().optional(),
    estimatedCost: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    vendorId: z.boolean().optional(),
    vendorNameSnap: z.boolean().optional(),
    mechanicalPartCatalogId: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    executionStatus: z.boolean().optional(),
    openedAt: z.boolean().optional(),
    startedAt: z.boolean().optional(),
    completedAt: z.boolean().optional(),
    canceledAt: z.boolean().optional(),
    actualCost: z.boolean().optional(),
    technicianId: z.boolean().optional(),
    summary: z.boolean().optional(),
    resolutionNote: z.boolean().optional(),
    completedByNameSnap: z.boolean().optional(),
    isConfirmed: z.boolean().optional(),
    confirmedAt: z.boolean().optional(),
    confirmedById: z.boolean().optional(),
    confirmedByNameSnap: z.boolean().optional(),
    MaintenanceRecord: z.boolean().optional(),
    TechnicalAssessment: z.boolean().optional(),
    MechanicalPartCatalog: z.boolean().optional(),
    ServiceCatalog: z.boolean().optional(),
    ServiceRequest: z.boolean().optional(),
    SupplyCatalog: z.boolean().optional(),
    User: z.boolean().optional(),
    Vendor: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const TechnicalIssueFindFirstSchema: z.ZodType<Prisma.TechnicalIssueFindFirstArgs> = z.object({ select: TechnicalIssueFindFirstSelectSchema.optional(), include: TechnicalIssueIncludeObjectSchema.optional(), orderBy: z.union([TechnicalIssueOrderByWithRelationInputObjectSchema, TechnicalIssueOrderByWithRelationInputObjectSchema.array()]).optional(), where: TechnicalIssueWhereInputObjectSchema.optional(), cursor: TechnicalIssueWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TechnicalIssueScalarFieldEnumSchema, TechnicalIssueScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalIssueFindFirstArgs>;

export const TechnicalIssueFindFirstZodSchema = z.object({ select: TechnicalIssueFindFirstSelectSchema.optional(), include: TechnicalIssueIncludeObjectSchema.optional(), orderBy: z.union([TechnicalIssueOrderByWithRelationInputObjectSchema, TechnicalIssueOrderByWithRelationInputObjectSchema.array()]).optional(), where: TechnicalIssueWhereInputObjectSchema.optional(), cursor: TechnicalIssueWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TechnicalIssueScalarFieldEnumSchema, TechnicalIssueScalarFieldEnumSchema.array()]).optional() }).strict();