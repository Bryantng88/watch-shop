import * as z from 'zod';

export const GoldColorSchema = z.enum(['YELLOW', 'WHITE', 'ROSE'])

export type GoldColor = z.infer<typeof GoldColorSchema>;