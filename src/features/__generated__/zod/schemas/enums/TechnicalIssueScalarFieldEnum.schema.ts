import * as z from 'zod';

export const TechnicalIssueScalarFieldEnumSchema = z.enum(['id', 'assessmentId', 'area', 'issueType', 'actionMode', 'serviceCatalogId', 'supplyCatalogId', 'note', 'estimatedCost', 'sortOrder', 'createdAt', 'updatedAt', 'vendorId', 'vendorNameSnap'])

export type TechnicalIssueScalarFieldEnum = z.infer<typeof TechnicalIssueScalarFieldEnumSchema>;