import * as z from 'zod';

import { CarrierRequestStatusSchema } from '../../enums/CarrierRequestStatus.schema';
// prettier-ignore
export const CarrierRequestResultSchema = z.object({
    id: z.string(),
    shipmentId: z.string(),
    carrierCode: z.string(),
    environment: z.string(),
    operation: z.string(),
    idempotencyKey: z.string(),
    requestJson: z.unknown(),
    responseJson: z.unknown().nullable(),
    status: CarrierRequestStatusSchema,
    httpStatus: z.number().int().nullable(),
    externalOrderCode: z.string().nullable(),
    errorCode: z.string().nullable(),
    errorMessage: z.string().nullable(),
    attemptCount: z.number().int(),
    requestedAt: z.date(),
    completedAt: z.date().nullable(),
    shipment: z.unknown()
}).strict();

export type CarrierRequestResultType = z.infer<typeof CarrierRequestResultSchema>;
