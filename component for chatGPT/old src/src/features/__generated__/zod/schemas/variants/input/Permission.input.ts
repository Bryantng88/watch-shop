import * as z from 'zod';

// prettier-ignore
export const PermissionInputSchema = z.object({
    id: z.string(),
    code: z.string(),
    description: z.string().optional().nullable(),
    roles: z.array(z.unknown())
}).strict();

export type PermissionInputType = z.infer<typeof PermissionInputSchema>;
