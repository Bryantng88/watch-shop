import * as z from 'zod';

// prettier-ignore
export const BankInputSchema = z.object({
    id: z.bigint(),
    created_at: z.date(),
    bankName: z.string(),
    Vendor: z.array(z.unknown())
}).strict();

export type BankInputType = z.infer<typeof BankInputSchema>;
