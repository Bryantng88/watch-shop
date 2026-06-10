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

export type UserInputType = z.infer<typeof UserInputSchema>;
