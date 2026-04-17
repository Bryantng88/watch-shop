import * as z from 'zod';

export const ImageRoleSchema = z.enum(['GALLERY', 'COVER', 'THUMB', 'INLINE'])

export type ImageRole = z.infer<typeof ImageRoleSchema>;