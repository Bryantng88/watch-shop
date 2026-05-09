import * as z from 'zod';

export const MediaAssetStatusSchema = z.enum(['ACTIVE', 'CHOSEN', 'ATTACHED', 'ARCHIVED', 'MISSING'])

export type MediaAssetStatus = z.infer<typeof MediaAssetStatusSchema>;