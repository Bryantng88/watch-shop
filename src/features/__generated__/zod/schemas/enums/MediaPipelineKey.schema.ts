import * as z from 'zod';

export const MediaPipelineKeySchema = z.enum(['MEN_STANDARD', 'WOMEN_LITE', 'UNISEX_STANDARD'])

export type MediaPipelineKey = z.infer<typeof MediaPipelineKeySchema>;