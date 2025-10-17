import * as z from 'zod';

export const ServiceRequestStatusSchema = z.enum(['PENDING', 'DIAGNOSING', 'WAIT_APPROVAL', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'CANCELED'])

export type ServiceRequestStatus = z.infer<typeof ServiceRequestStatusSchema>;