import * as z from 'zod';

export const ServiceDetailSchema = z.enum(['BASIC', 'OVERHAUL', 'SPA', 'PARTS_CHANGE', 'BATTERY_CHANGE'])

export type ServiceDetail = z.infer<typeof ServiceDetailSchema>;