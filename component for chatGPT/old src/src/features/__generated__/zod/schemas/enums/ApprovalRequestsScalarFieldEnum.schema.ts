import * as z from 'zod';

export const ApprovalRequestsScalarFieldEnumSchema = z.enum(['id', 'type', 'sourceModule', 'serviceRequestId', 'technicalAssessmentId', 'title', 'summary', 'status', 'autoApproved', 'payloadJson', 'reviewNote', 'createdAt', 'updatedAt'])

export type ApprovalRequestsScalarFieldEnum = z.infer<typeof ApprovalRequestsScalarFieldEnumSchema>;