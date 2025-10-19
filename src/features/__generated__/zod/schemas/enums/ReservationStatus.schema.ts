import * as z from 'zod';

export const ReservationStatusSchema = z.enum(['ACTIVE', 'CANCELLED', 'CONVERTED', 'EXPIRED'])

export type ReservationStatus = z.infer<typeof ReservationStatusSchema>;