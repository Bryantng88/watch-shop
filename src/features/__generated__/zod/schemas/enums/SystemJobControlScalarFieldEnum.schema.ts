import * as z from 'zod';

export const SystemJobControlScalarFieldEnumSchema = z.enum(['key', 'label', 'enabled', 'batchSize', 'pausedReason', 'metadata', 'updatedAt', 'updatedBy'])

export type SystemJobControlScalarFieldEnum = z.infer<typeof SystemJobControlScalarFieldEnumSchema>;