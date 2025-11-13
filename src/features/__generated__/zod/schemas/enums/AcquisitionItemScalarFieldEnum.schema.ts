import * as z from 'zod';

export const AcquisitionItemScalarFieldEnumSchema = z.enum(['id', 'acquisitionId', 'productId', 'variantId', 'quantity', 'unitCost', 'currency', 'notes', 'sourceOrderItemId', 'createdAt', 'kind', 'status', 'description', 'expectedReturnAt', 'returnedAt', 'vendorRmaNo', 'warrantyMonths', 'serviceRequestId', 'capitalizeToProduct'])

export type AcquisitionItemScalarFieldEnum = z.infer<typeof AcquisitionItemScalarFieldEnumSchema>;