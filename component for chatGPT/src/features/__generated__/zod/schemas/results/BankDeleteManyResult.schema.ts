import * as z from 'zod';
export const BankDeleteManyResultSchema = z.object({
  count: z.number()
});