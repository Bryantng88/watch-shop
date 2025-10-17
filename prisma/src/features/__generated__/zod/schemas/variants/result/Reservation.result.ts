import * as z from 'zod';

import { ReservationStatusSchema } from '../../enums/ReservationStatus.schema';
// prettier-ignore
export const ReservationResultSchema = z.object({
    id: z.string(),
    productId: z.string().nullable(),
    orderId: z.string().nullable(),
    status: ReservationStatusSchema,
    depositAmt: z.number().nullable(),
    expiresAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    product: z.unknown().nullable()
}).strict();

export type ReservationResultType = z.infer<typeof ReservationResultSchema>;
