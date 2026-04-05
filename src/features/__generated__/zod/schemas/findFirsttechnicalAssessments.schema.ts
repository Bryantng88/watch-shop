import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalAssessmentsIncludeObjectSchema as technicalAssessmentsIncludeObjectSchema } from './objects/technicalAssessmentsInclude.schema';
import { technicalAssessmentsOrderByWithRelationInputObjectSchema as technicalAssessmentsOrderByWithRelationInputObjectSchema } from './objects/technicalAssessmentsOrderByWithRelationInput.schema';
import { technicalAssessmentsWhereInputObjectSchema as technicalAssessmentsWhereInputObjectSchema } from './objects/technicalAssessmentsWhereInput.schema';
import { technicalAssessmentsWhereUniqueInputObjectSchema as technicalAssessmentsWhereUniqueInputObjectSchema } from './objects/technicalAssessmentsWhereUniqueInput.schema';
import { TechnicalAssessmentsScalarFieldEnumSchema } from './enums/TechnicalAssessmentsScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const technicalAssessmentsFindFirstSelectSchema: z.ZodType<Prisma.technicalAssessmentsSelect> = z.object({
    id: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    machineType: z.boolean().optional(),
    movementStatus: z.boolean().optional(),
    beforeRate: z.boolean().optional(),
    beforeAmp: z.boolean().optional(),
    beforeErr: z.boolean().optional(),
    afterRate: z.boolean().optional(),
    afterAmp: z.boolean().optional(),
    afterErr: z.boolean().optional(),
    appearanceScore: z.boolean().optional(),
    caseScore: z.boolean().optional(),
    glassScore: z.boolean().optional(),
    dialScore: z.boolean().optional(),
    caseIssues: z.boolean().optional(),
    glassIssues: z.boolean().optional(),
    dialIssues: z.boolean().optional(),
    caseManualDeduction: z.boolean().optional(),
    glassManualDeduction: z.boolean().optional(),
    dialManualDeduction: z.boolean().optional(),
    caseNote: z.boolean().optional(),
    glassNote: z.boolean().optional(),
    dialNote: z.boolean().optional(),
    crownStatus: z.boolean().optional(),
    crownAction: z.boolean().optional(),
    crownExecution: z.boolean().optional(),
    crownVendorId: z.boolean().optional(),
    crownPartId: z.boolean().optional(),
    crownCost: z.boolean().optional(),
    crownNote: z.boolean().optional(),
    movementCost: z.boolean().optional(),
    crownCostTotal: z.boolean().optional(),
    cosmeticProposalCost: z.boolean().optional(),
    totalCost: z.boolean().optional(),
    conclusion: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    approvalRequests: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.technicalAssessmentsSelect>;

export const technicalAssessmentsFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    machineType: z.boolean().optional(),
    movementStatus: z.boolean().optional(),
    beforeRate: z.boolean().optional(),
    beforeAmp: z.boolean().optional(),
    beforeErr: z.boolean().optional(),
    afterRate: z.boolean().optional(),
    afterAmp: z.boolean().optional(),
    afterErr: z.boolean().optional(),
    appearanceScore: z.boolean().optional(),
    caseScore: z.boolean().optional(),
    glassScore: z.boolean().optional(),
    dialScore: z.boolean().optional(),
    caseIssues: z.boolean().optional(),
    glassIssues: z.boolean().optional(),
    dialIssues: z.boolean().optional(),
    caseManualDeduction: z.boolean().optional(),
    glassManualDeduction: z.boolean().optional(),
    dialManualDeduction: z.boolean().optional(),
    caseNote: z.boolean().optional(),
    glassNote: z.boolean().optional(),
    dialNote: z.boolean().optional(),
    crownStatus: z.boolean().optional(),
    crownAction: z.boolean().optional(),
    crownExecution: z.boolean().optional(),
    crownVendorId: z.boolean().optional(),
    crownPartId: z.boolean().optional(),
    crownCost: z.boolean().optional(),
    crownNote: z.boolean().optional(),
    movementCost: z.boolean().optional(),
    crownCostTotal: z.boolean().optional(),
    cosmeticProposalCost: z.boolean().optional(),
    totalCost: z.boolean().optional(),
    conclusion: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    approvalRequests: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const technicalAssessmentsFindFirstSchema: z.ZodType<Prisma.technicalAssessmentsFindFirstArgs> = z.object({ select: technicalAssessmentsFindFirstSelectSchema.optional(), include: technicalAssessmentsIncludeObjectSchema.optional(), orderBy: z.union([technicalAssessmentsOrderByWithRelationInputObjectSchema, technicalAssessmentsOrderByWithRelationInputObjectSchema.array()]).optional(), where: technicalAssessmentsWhereInputObjectSchema.optional(), cursor: technicalAssessmentsWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TechnicalAssessmentsScalarFieldEnumSchema, TechnicalAssessmentsScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.technicalAssessmentsFindFirstArgs>;

export const technicalAssessmentsFindFirstZodSchema = z.object({ select: technicalAssessmentsFindFirstSelectSchema.optional(), include: technicalAssessmentsIncludeObjectSchema.optional(), orderBy: z.union([technicalAssessmentsOrderByWithRelationInputObjectSchema, technicalAssessmentsOrderByWithRelationInputObjectSchema.array()]).optional(), where: technicalAssessmentsWhereInputObjectSchema.optional(), cursor: technicalAssessmentsWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TechnicalAssessmentsScalarFieldEnumSchema, TechnicalAssessmentsScalarFieldEnumSchema.array()]).optional() }).strict();