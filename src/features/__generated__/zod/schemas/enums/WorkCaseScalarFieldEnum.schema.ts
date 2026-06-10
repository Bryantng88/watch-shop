import * as z from 'zod';

export const WorkCaseScalarFieldEnumSchema = z.enum(['id', 'refNo', 'title', 'description', 'scope', 'status', 'priority', 'watchId', 'categoryId', 'raisedByUserId', 'assignedToUserId', 'triagedAt', 'resolvedAt', 'cancelledAt', 'createdAt', 'updatedAt'])

export type WorkCaseScalarFieldEnum = z.infer<typeof WorkCaseScalarFieldEnumSchema>;