import * as z from 'zod';

// prettier-ignore
export const UserModelSchema = z.object({
    id: z.string(),
    email: z.string(),
    passwordHash: z.string().nullable(),
    name: z.string().nullable(),
    avatarUrl: z.string().nullable(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    roleId: z.string().nullable(),
    customer: z.unknown().nullable(),
    MaintenanceRecord: z.array(z.unknown()),
    ServiceRequest: z.array(z.unknown()),
    TechnicalIssue: z.array(z.unknown()),
    roles: z.array(z.unknown())
}).strict();

export type UserPureType = z.infer<typeof UserModelSchema>;
