import * as z from 'zod';

// prettier-ignore
export const RoleInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional().nullable(),
    Permission: z.array(z.unknown()),
    User: z.array(z.unknown())
}).strict();

export type RoleInputType = z.infer<typeof RoleInputSchema>;
