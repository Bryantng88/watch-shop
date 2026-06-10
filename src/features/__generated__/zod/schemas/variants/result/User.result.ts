import * as z from 'zod';

// prettier-ignore
export const UserResultSchema = z.object({
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
    maintenanceRecord: z.array(z.unknown()),
    notification: z.array(z.unknown()),
    serviceRequest: z.array(z.unknown()),
    technicalIssue: z.array(z.unknown()),
    roles: z.array(z.unknown()),
    createdTasks: z.array(z.unknown()),
    assignedTasks: z.array(z.unknown()),
    completedTasks: z.array(z.unknown()),
    cancelledTasks: z.array(z.unknown()),
    raisedWorkCases: z.array(z.unknown()),
    assignedWorkCases: z.array(z.unknown()),
    workCaseActivities: z.array(z.unknown())
}).strict();

export type UserResultType = z.infer<typeof UserResultSchema>;
