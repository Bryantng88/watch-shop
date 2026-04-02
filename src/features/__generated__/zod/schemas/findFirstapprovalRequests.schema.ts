import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { approvalRequestsIncludeObjectSchema as approvalRequestsIncludeObjectSchema } from './objects/approvalRequestsInclude.schema';
import { approvalRequestsOrderByWithRelationInputObjectSchema as approvalRequestsOrderByWithRelationInputObjectSchema } from './objects/approvalRequestsOrderByWithRelationInput.schema';
import { approvalRequestsWhereInputObjectSchema as approvalRequestsWhereInputObjectSchema } from './objects/approvalRequestsWhereInput.schema';
import { approvalRequestsWhereUniqueInputObjectSchema as approvalRequestsWhereUniqueInputObjectSchema } from './objects/approvalRequestsWhereUniqueInput.schema';
import { ApprovalRequestsScalarFieldEnumSchema } from './enums/ApprovalRequestsScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const approvalRequestsFindFirstSelectSchema: z.ZodType<Prisma.approvalRequestsSelect> = z.object({
    id: z.boolean().optional(),
    type: z.boolean().optional(),
    sourceModule: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    technicalAssessmentId: z.boolean().optional(),
    title: z.boolean().optional(),
    summary: z.boolean().optional(),
    status: z.boolean().optional(),
    autoApproved: z.boolean().optional(),
    payloadJson: z.boolean().optional(),
    reviewNote: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    technicalAssessments: z.boolean().optional(),
    maintenanceLogs: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.approvalRequestsSelect>;

export const approvalRequestsFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    type: z.boolean().optional(),
    sourceModule: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    technicalAssessmentId: z.boolean().optional(),
    title: z.boolean().optional(),
    summary: z.boolean().optional(),
    status: z.boolean().optional(),
    autoApproved: z.boolean().optional(),
    payloadJson: z.boolean().optional(),
    reviewNote: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    technicalAssessments: z.boolean().optional(),
    maintenanceLogs: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const approvalRequestsFindFirstSchema: z.ZodType<Prisma.approvalRequestsFindFirstArgs> = z.object({ select: approvalRequestsFindFirstSelectSchema.optional(), include: approvalRequestsIncludeObjectSchema.optional(), orderBy: z.union([approvalRequestsOrderByWithRelationInputObjectSchema, approvalRequestsOrderByWithRelationInputObjectSchema.array()]).optional(), where: approvalRequestsWhereInputObjectSchema.optional(), cursor: approvalRequestsWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ApprovalRequestsScalarFieldEnumSchema, ApprovalRequestsScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.approvalRequestsFindFirstArgs>;

export const approvalRequestsFindFirstZodSchema = z.object({ select: approvalRequestsFindFirstSelectSchema.optional(), include: approvalRequestsIncludeObjectSchema.optional(), orderBy: z.union([approvalRequestsOrderByWithRelationInputObjectSchema, approvalRequestsOrderByWithRelationInputObjectSchema.array()]).optional(), where: approvalRequestsWhereInputObjectSchema.optional(), cursor: approvalRequestsWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ApprovalRequestsScalarFieldEnumSchema, ApprovalRequestsScalarFieldEnumSchema.array()]).optional() }).strict();