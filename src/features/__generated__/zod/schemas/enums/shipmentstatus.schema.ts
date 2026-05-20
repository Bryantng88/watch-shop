import * as z from 'zod';

export const ShipmentStatusSchema = z.enum(['DRAFT', 'READY', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'])

export type ShipmentStatus = z.infer<typeof ShipmentStatusSchema>;