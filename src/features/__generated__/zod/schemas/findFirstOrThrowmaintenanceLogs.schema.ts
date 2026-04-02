import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { maintenanceLogsIncludeObjectSchema as maintenanceLogsIncludeObjectSchema } from './objects/maintenanceLogsInclude.schema';
import { maintenanceLogsOrderByWithRelationInputObjectSchema as maintenanceLogsOrderByWithRelationInputObjectSchema } from './objects/maintenanceLogsOrderByWithRelationInput.schema';
import { maintenanceLogsWhereInputObjectSchema as maintenanceLogsWhereInputObjectSchema } from './objects/maintenanceLogsWhereInput.schema';
import { maintenanceLogsWhereUniqueInputObjectSchema as maintenanceLogsWhereUniqueInputObjectSchema } from './objects/maintenanceLogsWhereUniqueInput.schema';
import { MaintenanceLogsScalarFieldEnumSchema } from './enums/MaintenanceLogsScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const maintenanceLogsFindFirstOrThrowSelectSchema: z.ZodType<Prisma.maintenanceLogsSelect> = z.object({
    id: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    technicalAssessmentId: z.boolean().optional(),
    approvalRequestId: z.boolean().optional(),
    sourceType: z.boolean().optional(),
    category: z.boolean().optional(),
    action: z.boolean().optional(),
    execution: z.boolean().optional(),
    vendorId: z.boolean().optional(),
    partId: z.boolean().optional(),
    cost: z.boolean().optional(),
    note: z.boolean().optional(),
    status: z.boolean().optional(),
    autoApproved: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    approvalRequests: z.boolean().optional(),
    technicalAssessments: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.maintenanceLogsSelect>;

export const maintenanceLogsFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    serviceRequestId: z.boolean().optional(),
    technicalAssessmentId: z.boolean().optional(),
    approvalRequestId: z.boolean().optional(),
    sourceType: z.boolean().optional(),
    category: z.boolean().optional(),
    action: z.boolean().optional(),
    execution: z.boolean().optional(),
    vendorId: z.boolean().optional(),
    partId: z.boolean().optional(),
    cost: z.boolean().optional(),
    note: z.boolean().optional(),
    status: z.boolean().optional(),
    autoApproved: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    approvalRequests: z.boolean().optional(),
    technicalAssessments: z.boolean().optional()
  }).strict();

export const maintenanceLogsFindFirstOrThrowSchema: z.ZodType<Prisma.maintenanceLogsFindFirstOrThrowArgs> = z.object({ select: maintenanceLogsFindFirstOrThrowSelectSchema.optional(), include: maintenanceLogsIncludeObjectSchema.optional(), orderBy: z.union([maintenanceLogsOrderByWithRelationInputObjectSchema, maintenanceLogsOrderByWithRelationInputObjectSchema.array()]).optional(), where: maintenanceLogsWhereInputObjectSchema.optional(), cursor: maintenanceLogsWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MaintenanceLogsScalarFieldEnumSchema, MaintenanceLogsScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.maintenanceLogsFindFirstOrThrowArgs>;

export const maintenanceLogsFindFirstOrThrowZodSchema = z.object({ select: maintenanceLogsFindFirstOrThrowSelectSchema.optional(), include: maintenanceLogsIncludeObjectSchema.optional(), orderBy: z.union([maintenanceLogsOrderByWithRelationInputObjectSchema, maintenanceLogsOrderByWithRelationInputObjectSchema.array()]).optional(), where: maintenanceLogsWhereInputObjectSchema.optional(), cursor: maintenanceLogsWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MaintenanceLogsScalarFieldEnumSchema, MaintenanceLogsScalarFieldEnumSchema.array()]).optional() }).strict();