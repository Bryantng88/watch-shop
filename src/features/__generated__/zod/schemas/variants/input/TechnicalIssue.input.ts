import * as z from 'zod';

import { TechnicalIssueTypeSchema } from '../../enums/TechnicalIssueType.schema';
import { TechnicalActionModeSchema } from '../../enums/TechnicalActionMode.schema';
import { TechnicalIssueExecutionStatusSchema } from '../../enums/TechnicalIssueExecutionStatus.schema';
// prettier-ignore
export const TechnicalIssueInputSchema = z.object({
    id: z.string(),
    assessmentId: z.string(),
    area: z.string().optional().nullable(),
    issueType: TechnicalIssueTypeSchema,
    actionMode: TechnicalActionModeSchema,
    serviceCatalogId: z.string().optional().nullable(),
    supplyCatalogId: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
    estimatedCost: z.number().optional().nullable(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    vendorId: z.string().optional().nullable(),
    vendorNameSnap: z.string().optional().nullable(),
    mechanicalPartCatalogId: z.string().optional().nullable(),
    serviceRequestId: z.string(),
    executionStatus: TechnicalIssueExecutionStatusSchema,
    openedAt: z.date(),
    startedAt: z.date().optional().nullable(),
    completedAt: z.date().optional().nullable(),
    canceledAt: z.date().optional().nullable(),
    actualCost: z.number().optional().nullable(),
    technicianId: z.string().optional().nullable(),
    summary: z.string().optional().nullable(),
    resolutionNote: z.string().optional().nullable(),
    completedByNameSnap: z.string().optional().nullable(),
    isConfirmed: z.boolean(),
    confirmedAt: z.date().optional().nullable(),
    confirmedById: z.string().optional().nullable(),
    confirmedByNameSnap: z.string().optional().nullable(),
    MaintenanceRecord: z.array(z.unknown()),
    TechnicalAssessment: z.unknown(),
    MechanicalPartCatalog: z.unknown().optional().nullable(),
    serviceCatalog: z.unknown().optional().nullable(),
    ServiceRequest: z.unknown(),
    SupplyCatalog: z.unknown().optional().nullable(),
    User: z.unknown().optional().nullable(),
    Vendor: z.unknown().optional().nullable()
}).strict();

export type TechnicalIssueInputType = z.infer<typeof TechnicalIssueInputSchema>;
