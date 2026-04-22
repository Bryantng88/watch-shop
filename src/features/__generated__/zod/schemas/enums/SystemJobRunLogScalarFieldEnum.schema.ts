import * as z from 'zod';

export const SystemJobRunLogScalarFieldEnumSchema = z.enum(['id', 'processorKey', 'triggerSource', 'status', 'processedCount', 'errorCount', 'note', 'detail', 'startedAt', 'finishedAt'])

export type SystemJobRunLogScalarFieldEnum = z.infer<typeof SystemJobRunLogScalarFieldEnumSchema>;