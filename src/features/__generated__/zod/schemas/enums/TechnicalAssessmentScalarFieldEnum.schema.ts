import * as z from 'zod';

export const TechnicalAssessmentScalarFieldEnumSchema = z.enum(['id', 'serviceRequestId', 'movementKind', 'preRate', 'preAmplitude', 'preBeatError', 'postRate', 'postAmplitude', 'postBeatError', 'actionMode', 'vendorId', 'vendorNameSnap', 'conclusion', 'imageFileKey', 'status', 'evaluatedById', 'evaluatedByNameSnap', 'createdAt', 'updatedAt', 'movementStatus', 'caseStatus', 'crystalStatus', 'crownStatus', 'payloadJson'])

export type TechnicalAssessmentScalarFieldEnum = z.infer<typeof TechnicalAssessmentScalarFieldEnumSchema>;