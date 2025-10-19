import * as z from 'zod';

// prettier-ignore
export const PermissionResultSchema = z.object({
    id: z.string(),
    code: z.string(),
    description: z.string().nullable(),
    roles: z.array(z.unknown())
}).strict();

export type PermissionResultType = z.infer<typeof PermissionResultSchema>;
