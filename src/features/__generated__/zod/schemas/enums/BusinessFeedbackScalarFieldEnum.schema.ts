import * as z from 'zod';

export const BusinessFeedbackScalarFieldEnumSchema = z.enum(['id', 'targetType', 'targetId', 'eventKey', 'actorUserId', 'message', 'visibility', 'metadataJson', 'createdAt', 'updatedAt'])

export type BusinessFeedbackScalarFieldEnum = z.infer<typeof BusinessFeedbackScalarFieldEnumSchema>;