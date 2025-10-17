import * as z from 'zod';

export const ServiceTypeSchema = z.enum(['WARRANTY', 'PAID'])

export type ServiceType = z.infer<typeof ServiceTypeSchema>;