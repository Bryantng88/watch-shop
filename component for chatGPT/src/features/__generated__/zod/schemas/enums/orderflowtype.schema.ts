import * as z from 'zod';

export const orderflowtypeSchema = z.enum(['STANDARD', 'QUICK_ORDER'])

export type orderflowtype = z.infer<typeof orderflowtypeSchema>;