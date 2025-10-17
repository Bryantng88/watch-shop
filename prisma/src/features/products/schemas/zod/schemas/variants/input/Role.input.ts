import * as z from 'zod';

// prettier-ignore
export const RoleInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional().nullable(),
    permissions: z.array(z.unknown()),
    users: z.array(z.unknown())
}).strict();

export type RoleInputType = z.infer<typeof RoleInputSchema>;
