import * as z from 'zod';

export const RoleScalarFieldEnumSchema = z.enum(['id', 'name', 'description'])

export type RoleScalarFieldEnum = z.infer<typeof RoleScalarFieldEnumSchema>;