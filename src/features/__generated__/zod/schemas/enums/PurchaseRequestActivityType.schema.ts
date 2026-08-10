import * as z from 'zod';

export const PurchaseRequestActivityTypeSchema = z.enum(['ASSIGNED', 'CONTACT_ATTEMPT', 'NOTE', 'FOLLOW_UP', 'STATUS_CHANGED'])

export type PurchaseRequestActivityType = z.infer<typeof PurchaseRequestActivityTypeSchema>;