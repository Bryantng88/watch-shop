import * as z from 'zod';

export const TechnicalAssessmentsScalarFieldEnumSchema = z.enum(['id', 'serviceRequestId', 'machineType', 'movementStatus', 'beforeRate', 'beforeAmp', 'beforeErr', 'afterRate', 'afterAmp', 'afterErr', 'appearanceScore', 'caseScore', 'glassScore', 'dialScore', 'caseIssues', 'glassIssues', 'dialIssues', 'caseManualDeduction', 'glassManualDeduction', 'dialManualDeduction', 'caseNote', 'glassNote', 'dialNote', 'crownStatus', 'crownAction', 'crownExecution', 'crownVendorId', 'crownPartId', 'crownCost', 'crownNote', 'movementCost', 'crownCostTotal', 'cosmeticProposalCost', 'totalCost', 'conclusion', 'createdAt', 'updatedAt'])

export type TechnicalAssessmentsScalarFieldEnum = z.infer<typeof TechnicalAssessmentsScalarFieldEnumSchema>;