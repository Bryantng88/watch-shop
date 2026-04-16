import * as z from 'zod';

// prettier-ignore
export const RoleResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    Permission: z.array(z.unknown()),
    User: z.array(z.unknown())
}).strict();

export type RoleResultType = z.infer<typeof RoleResultSchema>;
