import * as z from 'zod';

export const AcquisitionTypeSchema = z.enum(['PURCHASE', 'CONSIGNMENT', 'TRADE_IN', 'BUY_BACK'])

export type AcquisitionType = z.infer<typeof AcquisitionTypeSchema>;