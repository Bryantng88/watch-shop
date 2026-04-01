import * as z from 'zod';

export const TechnicalAssessmentScalarFieldEnumSchema = z.enum(['id', 'serviceRequestId', 'movementKind', 'runningOk', 'batteryWeak', 'batteryIssueBattery', 'batteryIssueIC', 'batteryIssueCoil', 'preRate', 'preAmplitude', 'preBeatError', 'postRate', 'postAmplitude', 'postBeatError', 'actionMode', 'vendorId', 'vendorNameSnap', 'diagnosis', 'conclusion', 'imageFileKey', 'status', 'evaluatedById', 'evaluatedByNameSnap', 'createdAt', 'updatedAt'])

export type TechnicalAssessmentScalarFieldEnum = z.infer<typeof TechnicalAssessmentScalarFieldEnumSchema>;