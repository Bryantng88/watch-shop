import * as z from 'zod';
export const BankFindFirstResultSchema = z.nullable(z.object({
  id: z.bigint(),
  created_at: z.date(),
  bankName: z.string(),
  Vendor: z.array(z.unknown())
}));