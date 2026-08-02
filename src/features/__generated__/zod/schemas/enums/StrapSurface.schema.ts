import * as z from 'zod';

export const StrapSurfaceSchema = z.enum(['SMOOTH', 'GRAINED'])

export type StrapSurface = z.infer<typeof StrapSurfaceSchema>;