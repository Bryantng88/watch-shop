import * as z from 'zod';

export const SystemJobRunLogScalarFieldEnumSchema = z.enum(['id', 'processor_key', 'trigger_source', 'status', 'processed_count', 'error_count', 'note', 'detail', 'started_at', 'finished_at'])

export type SystemJobRunLogScalarFieldEnum = z.infer<typeof SystemJobRunLogScalarFieldEnumSchema>;