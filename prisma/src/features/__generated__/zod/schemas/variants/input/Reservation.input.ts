import * as z from 'zod';

import { ReservationStatusSchema } from '../../enums/ReservationStatus.schema';
// prettier-ignore
export const ReservationInputSchema = z.object({
    id: z.string(),
    productId: z.string().optional().nullable(),
    orderId: z.string().optional().nullable(),
    status: ReservationStatusSchema,
    depositAmt: z.number().optional().nullable(),
    expiresAt: z.date().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    product: z.unknown().optional().nullable()
}).strict();

export type ReservationInputType = z.infer<typeof ReservationInputSchema>;
