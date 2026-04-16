import * as z from 'zod';
export const InvoiceCreateManyResultSchema = z.object({
  count: z.number()
});