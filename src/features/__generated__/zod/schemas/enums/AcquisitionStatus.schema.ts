import * as z from 'zod';

export const AcquisitionStatusSchema = z.enum(['DRAFT', 'POSTED', 'CANCELED'])

export type AcquisitionStatus = z.infer<typeof AcquisitionStatusSchema>;