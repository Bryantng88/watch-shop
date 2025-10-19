import * as z from 'zod';
export const InvoiceItemCreateManyResultSchema = z.object({
  count: z.number()
});