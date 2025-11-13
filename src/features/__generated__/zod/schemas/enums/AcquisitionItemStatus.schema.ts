import * as z from 'zod';

export const AcquisitionItemStatusSchema = z.enum(['DRAFT', 'SENT', 'IN_SERVICE', 'RETURNED', 'BILLED', 'CANCELLED'])

export type AcquisitionItemStatus = z.infer<typeof AcquisitionItemStatusSchema>;