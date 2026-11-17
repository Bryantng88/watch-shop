import * as z from 'zod';

export const WatchStyleSchema = z.enum(['MILITARY', 'DRESS', 'SPORT', 'TOOL', 'CASUAL', 'CLASSIC', 'MINIMALIST', 'LUXURY', 'RETRO', 'FUTURISTIC', 'DIVER', 'PILOT', 'RACING'])

export type WatchStyle = z.infer<typeof WatchStyleSchema>;