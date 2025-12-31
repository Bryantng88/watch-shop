import * as z from 'zod';

export const CustomerScalarFieldEnumSchema = z.enum(['id', 'name', 'email', 'phone', 'ward', 'city', 'userId', 'createdAt', 'updatedAt', 'address'])

export type CustomerScalarFieldEnum = z.infer<typeof CustomerScalarFieldEnumSchema>;