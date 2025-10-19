import * as z from 'zod';

// prettier-ignore
export const RoleResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    permissions: z.array(z.unknown()),
    users: z.array(z.unknown())
}).strict();

export type RoleResultType = z.infer<typeof RoleResultSchema>;
