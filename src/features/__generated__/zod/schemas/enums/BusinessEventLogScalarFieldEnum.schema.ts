import * as z from 'zod';

export const BusinessEventLogScalarFieldEnumSchema = z.enum(['id', 'eventKey', 'targetType', 'targetId', 'actorUserId', 'metadataJson', 'createdAt'])

export type BusinessEventLogScalarFieldEnum = z.infer<typeof BusinessEventLogScalarFieldEnumSchema>;