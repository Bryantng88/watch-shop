import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalIssueIncludeObjectSchema as TechnicalIssueIncludeObjectSchema } from './objects/TechnicalIssueInclude.schema';
import { TechnicalIssueOrderByWithRelationInputObjectSchema as TechnicalIssueOrderByWithRelationInputObjectSchema } from './objects/TechnicalIssueOrderByWithRelationInput.schema';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './objects/TechnicalIssueWhereInput.schema';
import { TechnicalIssueWhereUniqueInputObjectSchema as TechnicalIssueWhereUniqueInputObjectSchema } from './objects/TechnicalIssueWhereUniqueInput.schema';
import { TechnicalIssueScalarFieldEnumSchema } from './enums/TechnicalIssueScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TechnicalIssueFindFirstOrThrowSelectSchema: z.ZodType<Prisma.TechnicalIssueSelect> = z.object({
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
    TechnicalAssessment: z.boolean().optional(),
    ServiceCatalog: z.boolean().optional(),
    SupplyCatalog: z.boolean().optional(),
    Vendor: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.TechnicalIssueSelect>;

export const TechnicalIssueFindFirstOrThrowSelectZodSchema = z.object({
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
    TechnicalAssessment: z.boolean().optional(),
    ServiceCatalog: z.boolean().optional(),
    SupplyCatalog: z.boolean().optional(),
    Vendor: z.boolean().optional()
  }).strict();

export const TechnicalIssueFindFirstOrThrowSchema: z.ZodType<Prisma.TechnicalIssueFindFirstOrThrowArgs> = z.object({ select: TechnicalIssueFindFirstOrThrowSelectSchema.optional(), include: TechnicalIssueIncludeObjectSchema.optional(), orderBy: z.union([TechnicalIssueOrderByWithRelationInputObjectSchema, TechnicalIssueOrderByWithRelationInputObjectSchema.array()]).optional(), where: TechnicalIssueWhereInputObjectSchema.optional(), cursor: TechnicalIssueWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TechnicalIssueScalarFieldEnumSchema, TechnicalIssueScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalIssueFindFirstOrThrowArgs>;

export const TechnicalIssueFindFirstOrThrowZodSchema = z.object({ select: TechnicalIssueFindFirstOrThrowSelectSchema.optional(), include: TechnicalIssueIncludeObjectSchema.optional(), orderBy: z.union([TechnicalIssueOrderByWithRelationInputObjectSchema, TechnicalIssueOrderByWithRelationInputObjectSchema.array()]).optional(), where: TechnicalIssueWhereInputObjectSchema.optional(), cursor: TechnicalIssueWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TechnicalIssueScalarFieldEnumSchema, TechnicalIssueScalarFieldEnumSchema.array()]).optional() }).strict();