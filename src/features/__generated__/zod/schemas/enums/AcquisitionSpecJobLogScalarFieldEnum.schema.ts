import * as z from 'zod';

export const AcquisitionSpecJobLogScalarFieldEnumSchema = z.enum(['id', 'acquisitionSpecJobId', 'acquisitionItemId', 'acquisitionId', 'productId', 'stage', 'level', 'message', 'payload', 'createdAt'])

export type AcquisitionSpecJobLogScalarFieldEnum = z.infer<typeof AcquisitionSpecJobLogScalarFieldEnumSchema>;