import * as z from 'zod';

export const PostTargetScalarFieldEnumSchema = z.enum(['id', 'name', 'platform', 'isActive', 'createdAt', 'updatedAt'])

export type PostTargetScalarFieldEnum = z.infer<typeof PostTargetScalarFieldEnumSchema>;