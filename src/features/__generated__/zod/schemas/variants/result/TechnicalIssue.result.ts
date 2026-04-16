import * as z from 'zod';

import { TechnicalIssueTypeSchema } from '../../enums/TechnicalIssueType.schema';
import { TechnicalActionModeSchema } from '../../enums/TechnicalActionMode.schema';
import { TechnicalIssueExecutionStatusSchema } from '../../enums/TechnicalIssueExecutionStatus.schema';
// prettier-ignore
export const TechnicalIssueResultSchema = z.object({
    id: z.string(),
    assessmentId: z.string(),
    area: z.string().nullable(),
    issueType: TechnicalIssueTypeSchema,
    actionMode: TechnicalActionModeSchema,
    serviceCatalogId: z.string().nullable(),
    supplyCatalogId: z.string().nullable(),
    note: z.string().nullable(),
    estimatedCost: z.number().nullable(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    vendorId: z.string().nullable(),
    vendorNameSnap: z.string().nullable(),
    mechanicalPartCatalogId: z.string().nullable(),
    serviceRequestId: z.string(),
    executionStatus: TechnicalIssueExecutionStatusSchema,
    openedAt: z.date(),
    startedAt: z.date().nullable(),
    completedAt: z.date().nullable(),
    canceledAt: z.date().nullable(),
    actualCost: z.number().nullable(),
    technicianId: z.string().nullable(),
    summary: z.string().nullable(),
    resolutionNote: z.string().nullable(),
    completedByNameSnap: z.string().nullable(),
    isConfirmed: z.boolean(),
    confirmedAt: z.date().nullable(),
    confirmedById: z.string().nullable(),
    confirmedByNameSnap: z.string().nullable(),
    MaintenanceRecord: z.array(z.unknown()),
    TechnicalAssessment: z.unknown(),
    MechanicalPartCatalog: z.unknown().nullable(),
    serviceCatalog: z.unknown().nullable(),
    ServiceRequest: z.unknown(),
    SupplyCatalog: z.unknown().nullable(),
    User: z.unknown().nullable(),
    Vendor: z.unknown().nullable()
}).strict();

export type TechnicalIssueResultType = z.infer<typeof TechnicalIssueResultSchema>;
