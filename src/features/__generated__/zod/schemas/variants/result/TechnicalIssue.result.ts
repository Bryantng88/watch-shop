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
    priority: z.string().nullable(),
    resolutionNote: z.string().nullable(),
    completedByNameSnap: z.string().nullable(),
    isConfirmed: z.boolean(),
    confirmedAt: z.date().nullable(),
    confirmedById: z.string().nullable(),
    confirmedByNameSnap: z.string().nullable(),
    maintenanceRecord: z.array(z.unknown()),
    technicalAssessment: z.unknown(),
    MechanicalPartCatalog: z.unknown().nullable(),
    serviceCatalog: z.unknown().nullable(),
    serviceRequest: z.unknown(),
    SupplyCatalog: z.unknown().nullable(),
    user: z.unknown().nullable(),
    vendor: z.unknown().nullable(),
    technicalDetailCatalogId: z.string().nullable(),
    technicalDetailCatalog: z.unknown().nullable(),
    task: z.array(z.unknown()),
    payments: z.array(z.unknown()),
    TaskExecution: z.array(z.unknown())
}).strict();

export type TechnicalIssueResultType = z.infer<typeof TechnicalIssueResultSchema>;
