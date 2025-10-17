import * as z from 'zod';

export const ServicePrioritySchema = z.enum(['NORMAL', 'HIGH', 'URGENT'])

export type ServicePriority = z.infer<typeof ServicePrioritySchema>;