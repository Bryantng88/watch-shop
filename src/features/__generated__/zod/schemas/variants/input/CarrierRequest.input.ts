import * as z from 'zod';

import { CarrierRequestStatusSchema } from '../../enums/CarrierRequestStatus.schema';
// prettier-ignore
export const CarrierRequestInputSchema = z.object({
    id: z.string(),
    shipmentId: z.string(),
    carrierCode: z.string(),
    environment: z.string(),
    operation: z.string(),
    idempotencyKey: z.string(),
    requestJson: z.unknown(),
    responseJson: z.unknown().optional().nullable(),
    status: CarrierRequestStatusSchema,
    httpStatus: z.number().int().optional().nullable(),
    externalOrderCode: z.string().optional().nullable(),
    errorCode: z.string().optional().nullable(),
    errorMessage: z.string().optional().nullable(),
    attemptCount: z.number().int(),
    requestedAt: z.date(),
    completedAt: z.date().optional().nullable(),
    shipment: z.unknown()
}).strict();

export type CarrierRequestInputType = z.infer<typeof CarrierRequestInputSchema>;
