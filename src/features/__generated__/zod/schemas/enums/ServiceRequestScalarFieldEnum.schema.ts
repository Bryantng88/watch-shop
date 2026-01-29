import * as z from 'zod';

export const ServiceRequestScalarFieldEnumSchema = z.enum(['id', 'type', 'billable', 'orderItemId', 'customerId', 'productId', 'variantId', 'brandSnapshot', 'modelSnapshot', 'refSnapshot', 'serialSnapshot', 'appointmentAt', 'status', 'notes', 'warrantyUntil', 'warrantyPolicy', 'createdAt', 'updatedAt', 'servicecatalogid', 'refNo'])

export type ServiceRequestScalarFieldEnum = z.infer<typeof ServiceRequestScalarFieldEnumSchema>;