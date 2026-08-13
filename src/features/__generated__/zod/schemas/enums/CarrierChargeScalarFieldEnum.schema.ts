import * as z from 'zod';

export const CarrierChargeScalarFieldEnumSchema = z.enum(['id', 'shipmentId', 'kind', 'currency', 'estimatedAmount', 'chargedAmount', 'settlementStatus', 'settlementRef', 'settledAt', 'metadataJson', 'createdAt', 'updatedAt'])

export type CarrierChargeScalarFieldEnum = z.infer<typeof CarrierChargeScalarFieldEnumSchema>;