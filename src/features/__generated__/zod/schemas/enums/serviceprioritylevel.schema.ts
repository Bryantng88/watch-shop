import * as z from 'zod';

export const ServicePriorityLevelSchema = z.enum(['NORMAL', 'HIGH', 'URGENT'])

export type ServicePriorityLevel = z.infer<typeof ServicePriorityLevelSchema>;