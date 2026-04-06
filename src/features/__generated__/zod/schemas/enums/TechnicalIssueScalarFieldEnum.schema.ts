import * as z from 'zod';

export const TechnicalIssueScalarFieldEnumSchema = z.enum(['id', 'assessmentId', 'area', 'issueType', 'actionMode', 'serviceCatalogId', 'supplyCatalogId', 'note', 'estimatedCost', 'sortOrder', 'createdAt', 'updatedAt', 'vendorId', 'vendorNameSnap', 'mechanicalPartCatalogId', 'serviceRequestId', 'executionStatus', 'openedAt', 'startedAt', 'completedAt', 'canceledAt', 'actualCost', 'technicianId', 'summary', 'resolutionNote', 'completedByNameSnap', 'isConfirmed', 'confirmedAt', 'confirmedById', 'confirmedByNameSnap'])

export type TechnicalIssueScalarFieldEnum = z.infer<typeof TechnicalIssueScalarFieldEnumSchema>;