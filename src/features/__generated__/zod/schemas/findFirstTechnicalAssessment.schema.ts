import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalAssessmentIncludeObjectSchema as TechnicalAssessmentIncludeObjectSchema } from './objects/TechnicalAssessmentInclude.schema';
import { TechnicalAssessmentOrderByWithRelationInputObjectSchema as TechnicalAssessmentOrderByWithRelationInputObjectSchema } from './objects/TechnicalAssessmentOrderByWithRelationInput.schema';
import { TechnicalAssessmentWhereInputObjectSchema as TechnicalAssessmentWhereInputObjectSchema } from './objects/TechnicalAssessmentWhereInput.schema';
import { TechnicalAssessmentWhereUniqueInputObjectSchema as TechnicalAssessmentWhereUniqueInputObjectSchema } from './objects/TechnicalAssessmentWhereUniqueInput.schema';
import { TechnicalAssessmentScalarFieldEnumSchema } from './enums/TechnicalAssessmentScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TechnicalAssessmentFindFirstSelectSchema: z.ZodType<Prisma.TechnicalAssessmentSelect> = z.object({
    id: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    movementKind: z.boolean().optional(),
    preRate: z.boolean().optional(),
    preAmplitude: z.boolean().optional(),
    preBeatError: z.boolean().optional(),
    postRate: z.boolean().optional(),
    postAmplitude: z.boolean().optional(),
    postBeatError: z.boolean().optional(),
    actionMode: z.boolean().optional(),
    vendorId: z.boolean().optional(),
    vendorNameSnap: z.boolean().optional(),
    conclusion: z.boolean().optional(),
    imageFileKey: z.boolean().optional(),
    status: z.boolean().optional(),
    evaluatedById: z.boolean().optional(),
    evaluatedByNameSnap: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    movementStatus: z.boolean().optional(),
    caseStatus: z.boolean().optional(),
    crystalStatus: z.boolean().optional(),
    crownStatus: z.boolean().optional(),
    payloadJson: z.boolean().optional(),
    ServiceRequest: z.boolean().optional(),
    Vendor: z.boolean().optional(),
    TechnicalIssue: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.TechnicalAssessmentSelect>;

export const TechnicalAssessmentFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    movementKind: z.boolean().optional(),
    preRate: z.boolean().optional(),
    preAmplitude: z.boolean().optional(),
    preBeatError: z.boolean().optional(),
    postRate: z.boolean().optional(),
    postAmplitude: z.boolean().optional(),
    postBeatError: z.boolean().optional(),
    actionMode: z.boolean().optional(),
    vendorId: z.boolean().optional(),
    vendorNameSnap: z.boolean().optional(),
    conclusion: z.boolean().optional(),
    imageFileKey: z.boolean().optional(),
    status: z.boolean().optional(),
    evaluatedById: z.boolean().optional(),
    evaluatedByNameSnap: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    movementStatus: z.boolean().optional(),
    caseStatus: z.boolean().optional(),
    crystalStatus: z.boolean().optional(),
    crownStatus: z.boolean().optional(),
    payloadJson: z.boolean().optional(),
    ServiceRequest: z.boolean().optional(),
    Vendor: z.boolean().optional(),
    TechnicalIssue: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const TechnicalAssessmentFindFirstSchema: z.ZodType<Prisma.TechnicalAssessmentFindFirstArgs> = z.object({ select: TechnicalAssessmentFindFirstSelectSchema.optional(), include: TechnicalAssessmentIncludeObjectSchema.optional(), orderBy: z.union([TechnicalAssessmentOrderByWithRelationInputObjectSchema, TechnicalAssessmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: TechnicalAssessmentWhereInputObjectSchema.optional(), cursor: TechnicalAssessmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TechnicalAssessmentScalarFieldEnumSchema, TechnicalAssessmentScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalAssessmentFindFirstArgs>;

export const TechnicalAssessmentFindFirstZodSchema = z.object({ select: TechnicalAssessmentFindFirstSelectSchema.optional(), include: TechnicalAssessmentIncludeObjectSchema.optional(), orderBy: z.union([TechnicalAssessmentOrderByWithRelationInputObjectSchema, TechnicalAssessmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: TechnicalAssessmentWhereInputObjectSchema.optional(), cursor: TechnicalAssessmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TechnicalAssessmentScalarFieldEnumSchema, TechnicalAssessmentScalarFieldEnumSchema.array()]).optional() }).strict();