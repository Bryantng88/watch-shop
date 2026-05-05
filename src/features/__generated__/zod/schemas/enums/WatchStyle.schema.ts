import * as z from 'zod';

export const WatchStyleSchema = z.enum(['MILITARY', 'DRESS', 'SPORT', 'TOOL', 'CASUAL', 'CLASSIC', 'MINIMALIST', 'LUXURY', 'RETRO', 'FUTURISTIC'])

export type WatchStyle = z.infer<typeof WatchStyleSchema>;