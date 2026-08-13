import * as z from 'zod';

export const CarrierRequestScalarFieldEnumSchema = z.enum(['id', 'shipmentId', 'carrierCode', 'environment', 'operation', 'idempotencyKey', 'requestJson', 'responseJson', 'status', 'httpStatus', 'externalOrderCode', 'errorCode', 'errorMessage', 'attemptCount', 'requestedAt', 'completedAt'])

export type CarrierRequestScalarFieldEnum = z.infer<typeof CarrierRequestScalarFieldEnumSchema>;