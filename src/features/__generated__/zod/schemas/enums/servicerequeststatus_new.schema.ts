import * as z from 'zod';

export const ServiceRequestStatus_NewSchema = z.enum(['DRAFT', 'DIAGNOSING', 'WAIT_APPROVAL', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'CANCELED'])

export type ServiceRequestStatus_New = z.infer<typeof ServiceRequestStatus_NewSchema>;