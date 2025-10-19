import * as z from 'zod';

export const MaintenanceRecordScalarFieldEnumSchema = z.enum(['id', 'type', 'billable', 'serviceRequestId', 'productId', 'variantId', 'brandSnapshot', 'modelSnapshot', 'refSnapshot', 'serialSnapshot', 'vendorId', 'servicedByName', 'vendorName', 'servicedAt', 'notes', 'totalCost', 'billed', 'invoiceId', 'revenueAmount', 'currency'])

export type MaintenanceRecordScalarFieldEnum = z.infer<typeof MaintenanceRecordScalarFieldEnumSchema>;