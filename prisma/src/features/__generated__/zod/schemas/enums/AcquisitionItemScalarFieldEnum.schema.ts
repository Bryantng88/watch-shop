import * as z from 'zod';

export const AcquisitionItemScalarFieldEnumSchema = z.enum(['id', 'acquisitionId', 'productId', 'variantId', 'quantity', 'unitCost', 'currency', 'notes', 'sourceOrderItemId', 'createdAt'])

export type AcquisitionItemScalarFieldEnum = z.infer<typeof AcquisitionItemScalarFieldEnumSchema>;