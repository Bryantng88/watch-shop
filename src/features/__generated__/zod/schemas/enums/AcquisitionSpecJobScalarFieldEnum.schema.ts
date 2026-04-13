import * as z from 'zod';

export const AcquisitionSpecJobScalarFieldEnumSchema = z.enum(['id', 'acquisitionItemId', 'productId', 'status', 'attempts', 'lastError', 'startedAt', 'finishedAt', 'createdAt', 'updatedAt', 'runAfter', 'priority'])

export type AcquisitionSpecJobScalarFieldEnum = z.infer<typeof AcquisitionSpecJobScalarFieldEnumSchema>;