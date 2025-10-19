import * as z from 'zod';

export const StrapSchema = z.enum(['LEATHER', 'BRACELET', 'RUBBER', 'NATO', 'CANVASS', 'SPECIAL'])

export type Strap = z.infer<typeof StrapSchema>;