import * as z from 'zod';
export const BankCreateManyResultSchema = z.object({
  count: z.number()
});