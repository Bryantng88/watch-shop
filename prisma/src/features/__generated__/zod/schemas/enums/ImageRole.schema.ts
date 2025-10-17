import * as z from 'zod';

export const ImageRoleSchema = z.enum(['PRIMARY', 'GALLERY', 'THUMB', 'COVER'])

export type ImageRole = z.infer<typeof ImageRoleSchema>;