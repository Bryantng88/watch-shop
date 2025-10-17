import * as z from 'zod';

export const PermissionScalarFieldEnumSchema = z.enum(['id', 'code', 'description'])

export type PermissionScalarFieldEnum = z.infer<typeof PermissionScalarFieldEnumSchema>;