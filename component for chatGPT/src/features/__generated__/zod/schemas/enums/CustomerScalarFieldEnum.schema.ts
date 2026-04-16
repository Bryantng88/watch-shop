import * as z from 'zod';

export const CustomerScalarFieldEnumSchema = z.enum(['id', 'name', 'email', 'phone', 'ward', 'city', 'userId', 'createdAt', 'updatedAt', 'address', 'district'])

export type CustomerScalarFieldEnum = z.infer<typeof CustomerScalarFieldEnumSchema>;