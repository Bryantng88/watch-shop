import * as z from 'zod';

export const MaintenancePartScalarFieldEnumSchema = z.enum(['id', 'recordId', 'variantId', 'name', 'quantity', 'unitCost', 'notes'])

export type MaintenancePartScalarFieldEnum = z.infer<typeof MaintenancePartScalarFieldEnumSchema>;