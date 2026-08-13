import * as z from 'zod';

export const CarrierSettlementStatusSchema = z.enum(['ESTIMATED', 'ACCRUED', 'PAID', 'DEDUCTED', 'INVOICED', 'CANCELLED'])

export type CarrierSettlementStatus = z.infer<typeof CarrierSettlementStatusSchema>;