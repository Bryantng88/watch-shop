import * as z from 'zod';

import { TechnicalIssueTypeSchema } from '../../enums/TechnicalIssueType.schema';
import { TechnicalActionModeSchema } from '../../enums/TechnicalActionMode.schema';
// prettier-ignore
export const TechnicalIssueModelSchema = z.object({
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
    TechnicalAssessment: z.unknown(),
    ServiceCatalog: z.unknown().nullable(),
    SupplyCatalog: z.unknown().nullable(),
    Vendor: z.unknown().nullable()
}).strict();

export type TechnicalIssuePureType = z.infer<typeof TechnicalIssueModelSchema>;
