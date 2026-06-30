import * as z from 'zod';

export const TimelineEntryScalarFieldEnumSchema = z.enum(['id', 'containerType', 'containerId', 'sourceType', 'sourceId', 'occurredAt', 'actorUserId', 'title', 'bodySnapshot', 'visibility', 'metadataJson', 'createdAt', 'updatedAt'])

export type TimelineEntryScalarFieldEnum = z.infer<typeof TimelineEntryScalarFieldEnumSchema>;