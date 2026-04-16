import * as z from 'zod';

export const servicerequeststatus_newSchema = z.enum(['DRAFT', 'DIAGNOSING', 'WAIT_APPROVAL', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'CANCELED'])

export type servicerequeststatus_new = z.infer<typeof servicerequeststatus_newSchema>;