import * as z from 'zod';

export const UserRoleSchema = z.enum(['ADMIN', 'STAFF', 'CUSTOMER'])

export type UserRole = z.infer<typeof UserRoleSchema>;