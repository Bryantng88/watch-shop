import * as z from 'zod';

export const serviceprioritylevelSchema = z.enum(['NORMAL', 'HIGH', 'URGENT'])

export type serviceprioritylevel = z.infer<typeof serviceprioritylevelSchema>;