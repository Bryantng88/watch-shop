import * as z from 'zod';

export const AcquisitionSpecJobScalarFieldEnumSchema = z.enum(['id', 'acquisition_item_id', 'product_id', 'status', 'attempts', 'last_error', 'priority', 'run_after', 'started_at', 'finished_at', 'created_at', 'updated_at'])

export type AcquisitionSpecJobScalarFieldEnum = z.infer<typeof AcquisitionSpecJobScalarFieldEnumSchema>;