import * as z from 'zod';

// prettier-ignore
export const BankResultSchema = z.object({
    id: z.bigint(),
    created_at: z.date(),
    bankName: z.string(),
    Vendor: z.array(z.unknown())
}).strict();

export type BankResultType = z.infer<typeof BankResultSchema>;
