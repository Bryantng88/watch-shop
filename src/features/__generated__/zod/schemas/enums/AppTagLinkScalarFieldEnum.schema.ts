import * as z from 'zod';

export const AppTagLinkScalarFieldEnumSchema = z.enum(['id', 'tagId', 'targetType', 'targetId', 'createdAt'])

export type AppTagLinkScalarFieldEnum = z.infer<typeof AppTagLinkScalarFieldEnumSchema>;