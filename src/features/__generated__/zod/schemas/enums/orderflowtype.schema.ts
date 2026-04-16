import * as z from 'zod';

export const OrderFlowTypeSchema = z.enum(['STANDARD', 'QUICK_ORDER'])

export type OrderFlowType = z.infer<typeof OrderFlowTypeSchema>;