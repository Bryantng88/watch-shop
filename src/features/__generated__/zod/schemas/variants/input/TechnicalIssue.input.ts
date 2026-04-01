import * as z from 'zod';

import { TechnicalIssueTypeSchema } from '../../enums/TechnicalIssueType.schema';
import { TechnicalActionModeSchema } from '../../enums/TechnicalActionMode.schema';
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
    TechnicalAssessment: z.unknown(),
    MechanicalPartCatalog: z.unknown().optional().nullable(),
    ServiceCatalog: z.unknown().optional().nullable(),
    SupplyCatalog: z.unknown().optional().nullable(),
    Vendor: z.unknown().optional().nullable()
}).strict();

export type TechnicalIssueInputType = z.infer<typeof TechnicalIssueInputSchema>;
