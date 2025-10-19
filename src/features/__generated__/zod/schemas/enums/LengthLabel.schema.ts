import * as z from 'zod';

export const LengthLabelSchema = z.enum(['L16', 'L17', 'L18', 'L19', 'L20'])

export type LengthLabel = z.infer<typeof LengthLabelSchema>;