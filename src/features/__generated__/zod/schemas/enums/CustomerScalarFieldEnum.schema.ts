import * as z from 'zod';

<<<<<<< HEAD
export const CustomerScalarFieldEnumSchema = z.enum(['id', 'name', 'email', 'phone', 'ward', 'city', 'userId', 'createdAt', 'updatedAt', 'address'])
=======
export const CustomerScalarFieldEnumSchema = z.enum(['id', 'name', 'email', 'phone', 'ward', 'city', 'userId', 'createdAt', 'updatedAt', 'address', 'district'])
>>>>>>> 4f6d70506e71757ff795315d849e6d5ac7fcf052

export type CustomerScalarFieldEnum = z.infer<typeof CustomerScalarFieldEnumSchema>;