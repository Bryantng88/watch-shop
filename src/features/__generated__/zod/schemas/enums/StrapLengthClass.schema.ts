import * as z from 'zod';

export const StrapLengthClassSchema = z.enum(['SHORT', 'STANDARD', 'LONG', 'CUSTOM'])

export type StrapLengthClass = z.infer<typeof StrapLengthClassSchema>;