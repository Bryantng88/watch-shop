import * as z from 'zod';

export const shipmentstatusSchema = z.enum(['DRAFT', 'READY', 'SHIPPED', 'DELIVERED', 'CANCELLED'])

export type shipmentstatus = z.infer<typeof shipmentstatusSchema>;