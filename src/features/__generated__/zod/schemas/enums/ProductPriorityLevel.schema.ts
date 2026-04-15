import * as z from 'zod';

export const ProductPriorityLevelSchema = z.enum(['NORMAL', 'HIGH', 'URGENT'])

export type ProductPriorityLevel = z.infer<typeof ProductPriorityLevelSchema>;