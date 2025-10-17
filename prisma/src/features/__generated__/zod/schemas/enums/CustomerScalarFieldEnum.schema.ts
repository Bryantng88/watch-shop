import * as z from 'zod';

export const CustomerScalarFieldEnumSchema = z.enum(['id', 'name', 'email', 'phone', 'ward', 'city', 'userId', 'createdAt', 'updatedAt'])

export type CustomerScalarFieldEnum = z.infer<typeof CustomerScalarFieldEnumSchema>;