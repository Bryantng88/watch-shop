import * as z from 'zod';

export const UserCommentScalarFieldEnumSchema = z.enum(['id', 'targetType', 'targetId', 'actorUserId', 'body', 'visibility', 'metadataJson', 'createdAt', 'updatedAt'])

export type UserCommentScalarFieldEnum = z.infer<typeof UserCommentScalarFieldEnumSchema>;