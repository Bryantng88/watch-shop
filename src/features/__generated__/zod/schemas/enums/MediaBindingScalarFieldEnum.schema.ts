import * as z from 'zod';

export const MediaBindingScalarFieldEnumSchema = z.enum(['id', 'mediaObjectId', 'ownerType', 'ownerId', 'role', 'sortOrder', 'audienceSegment', 'lifecycle', 'pipelineKey', 'createdAt', 'updatedAt'])

export type MediaBindingScalarFieldEnum = z.infer<typeof MediaBindingScalarFieldEnumSchema>;