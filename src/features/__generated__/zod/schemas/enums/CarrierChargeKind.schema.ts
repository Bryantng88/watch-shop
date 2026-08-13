import * as z from 'zod';

export const CarrierChargeKindSchema = z.enum(['SHIPPING', 'INSURANCE', 'COD_FEE', 'RETURN_FEE', 'SURCHARGE'])

export type CarrierChargeKind = z.infer<typeof CarrierChargeKindSchema>;