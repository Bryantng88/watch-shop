import * as z from 'zod';

export const WorkflowEventLogScalarFieldEnumSchema = z.enum(['id', 'eventKey', 'targetType', 'targetId', 'actorUserId', 'metadataJson', 'createdAt'])

export type WorkflowEventLogScalarFieldEnum = z.infer<typeof WorkflowEventLogScalarFieldEnumSchema>;