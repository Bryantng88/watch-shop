import * as z from 'zod';

export const WorkCaseActivityScalarFieldEnumSchema = z.enum(['id', 'workCaseId', 'actorId', 'action', 'note', 'metadata', 'createdAt'])

export type WorkCaseActivityScalarFieldEnum = z.infer<typeof WorkCaseActivityScalarFieldEnumSchema>;