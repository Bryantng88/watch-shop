import * as z from 'zod';

export const StrapClaspTypeSchema = z.enum(['PIN_BUCKLE', 'DEPLOYANT', 'FOLDING', 'BRACELET_CLASP', 'NONE', 'OTHER'])

export type StrapClaspType = z.infer<typeof StrapClaspTypeSchema>;