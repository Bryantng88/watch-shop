import * as z from 'zod';

export const MediaOwnerTypeSchema = z.enum(['WATCH', 'ACQUISITION', 'PRODUCT', 'LISTING'])

export type MediaOwnerType = z.infer<typeof MediaOwnerTypeSchema>;