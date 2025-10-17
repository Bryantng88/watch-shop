import * as z from 'zod';
export const InvoiceItemDeleteManyResultSchema = z.object({
  count: z.number()
});