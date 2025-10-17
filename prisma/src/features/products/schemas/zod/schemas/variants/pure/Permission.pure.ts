import * as z from 'zod';

// prettier-ignore
export const PermissionModelSchema = z.object({
    id: z.string(),
    code: z.string(),
    description: z.string().nullable(),
    roles: z.array(z.unknown())
}).strict();

export type PermissionPureType = z.infer<typeof PermissionModelSchema>;
