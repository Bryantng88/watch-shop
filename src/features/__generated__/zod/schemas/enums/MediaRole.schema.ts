import * as z from 'zod';

export const MediaRoleSchema = z.enum(['COVER', 'GALLERY', 'INLINE', 'SOCIAL', 'THUMBNAIL'])

export type MediaRole = z.infer<typeof MediaRoleSchema>;