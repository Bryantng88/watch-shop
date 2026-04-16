import * as z from 'zod';

export const UserScalarFieldEnumSchema = z.enum(['id', 'email', 'passwordHash', 'name', 'avatarUrl', 'isActive', 'createdAt', 'updatedAt', 'roleId'])

export type UserScalarFieldEnum = z.infer<typeof UserScalarFieldEnumSchema>;