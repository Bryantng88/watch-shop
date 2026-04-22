import * as z from 'zod';

export const SystemJobControlScalarFieldEnumSchema = z.enum(['key', 'label', 'enabled', 'batchSize', 'pausedReason', 'metadata', 'updated_at', 'updated_by'])

export type SystemJobControlScalarFieldEnum = z.infer<typeof SystemJobControlScalarFieldEnumSchema>;