import * as z from 'zod';

// prettier-ignore
export const RoleModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    permissions: z.array(z.unknown()),
    users: z.array(z.unknown())
}).strict();

export type RolePureType = z.infer<typeof RoleModelSchema>;
