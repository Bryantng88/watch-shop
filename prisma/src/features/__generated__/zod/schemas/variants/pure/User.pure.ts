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
    roles: z.array(z.unknown())
}).strict();

export type UserPureType = z.infer<typeof UserModelSchema>;
