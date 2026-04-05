import * as z from 'zod';

// prettier-ignore
export const UserInputSchema = z.object({
    id: z.string(),
    email: z.string(),
    passwordHash: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    avatarUrl: z.string().optional().nullable(),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    roleId: z.string().optional().nullable(),
    customer: z.unknown().optional().nullable(),
    MaintenanceRecord: z.array(z.unknown()),
    ServiceRequest: z.array(z.unknown()),
    TechnicalIssue: z.array(z.unknown()),
    roles: z.array(z.unknown())
}).strict();

export type UserInputType = z.infer<typeof UserInputSchema>;
