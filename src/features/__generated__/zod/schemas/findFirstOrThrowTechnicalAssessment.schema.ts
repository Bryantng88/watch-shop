import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalAssessmentIncludeObjectSchema as TechnicalAssessmentIncludeObjectSchema } from './objects/TechnicalAssessmentInclude.schema';
import { TechnicalAssessmentOrderByWithRelationInputObjectSchema as TechnicalAssessmentOrderByWithRelationInputObjectSchema } from './objects/TechnicalAssessmentOrderByWithRelationInput.schema';
import { TechnicalAssessmentWhereInputObjectSchema as TechnicalAssessmentWhereInputObjectSchema } from './objects/TechnicalAssessmentWhereInput.schema';
import { TechnicalAssessmentWhereUniqueInputObjectSchema as TechnicalAssessmentWhereUniqueInputObjectSchema } from './objects/TechnicalAssessmentWhereUniqueInput.schema';
import { TechnicalAssessmentScalarFieldEnumSchema } from './enums/TechnicalAssessmentScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TechnicalAssessmentFindFirstOrThrowSelectSchema: z.ZodType<Prisma.TechnicalAssessmentSelect> = z.object({
    id: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    movementKind: z.boolean().optional(),
    runningOk: z.boolean().optional(),
    batteryWeak: z.boolean().optional(),
    batteryIssueBattery: z.boolean().optional(),
    batteryIssueIC: z.boolean().optional(),
    batteryIssueCoil: z.boolean().optional(),
    preRate: z.boolean().optional(),
    preAmplitude: z.boolean().optional(),
    preBeatError: z.boolean().optional(),
    postRate: z.boolean().optional(),
    postAmplitude: z.boolean().optional(),
    postBeatError: z.boolean().optional(),
    actionMode: z.boolean().optional(),
    vendorId: z.boolean().optional(),
    vendorNameSnap: z.boolean().optional(),
    diagnosis: z.boolean().optional(),
    conclusion: z.boolean().optional(),
    imageFileKey: z.boolean().optional(),
    status: z.boolean().optional(),
    evaluatedById: z.boolean().optional(),
    evaluatedByNameSnap: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    ServiceRequest: z.boolean().optional(),
    Vendor: z.boolean().optional(),
    TechnicalIssue: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.TechnicalAssessmentSelect>;

export const TechnicalAssessmentFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    movementKind: z.boolean().optional(),
    runningOk: z.boolean().optional(),
    batteryWeak: z.boolean().optional(),
    batteryIssueBattery: z.boolean().optional(),
    batteryIssueIC: z.boolean().optional(),
    batteryIssueCoil: z.boolean().optional(),
    preRate: z.boolean().optional(),
    preAmplitude: z.boolean().optional(),
    preBeatError: z.boolean().optional(),
    postRate: z.boolean().optional(),
    postAmplitude: z.boolean().optional(),
    postBeatError: z.boolean().optional(),
    actionMode: z.boolean().optional(),
    vendorId: z.boolean().optional(),
    vendorNameSnap: z.boolean().optional(),
    diagnosis: z.boolean().optional(),
    conclusion: z.boolean().optional(),
    imageFileKey: z.boolean().optional(),
    status: z.boolean().optional(),
    evaluatedById: z.boolean().optional(),
    evaluatedByNameSnap: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    ServiceRequest: z.boolean().optional(),
    Vendor: z.boolean().optional(),
    TechnicalIssue: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const TechnicalAssessmentFindFirstOrThrowSchema: z.ZodType<Prisma.TechnicalAssessmentFindFirstOrThrowArgs> = z.object({ select: TechnicalAssessmentFindFirstOrThrowSelectSchema.optional(), include: TechnicalAssessmentIncludeObjectSchema.optional(), orderBy: z.union([TechnicalAssessmentOrderByWithRelationInputObjectSchema, TechnicalAssessmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: TechnicalAssessmentWhereInputObjectSchema.optional(), cursor: TechnicalAssessmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TechnicalAssessmentScalarFieldEnumSchema, TechnicalAssessmentScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalAssessmentFindFirstOrThrowArgs>;

export const TechnicalAssessmentFindFirstOrThrowZodSchema = z.object({ select: TechnicalAssessmentFindFirstOrThrowSelectSchema.optional(), include: TechnicalAssessmentIncludeObjectSchema.optional(), orderBy: z.union([TechnicalAssessmentOrderByWithRelationInputObjectSchema, TechnicalAssessmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: TechnicalAssessmentWhereInputObjectSchema.optional(), cursor: TechnicalAssessmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TechnicalAssessmentScalarFieldEnumSchema, TechnicalAssessmentScalarFieldEnumSchema.array()]).optional() }).strict();