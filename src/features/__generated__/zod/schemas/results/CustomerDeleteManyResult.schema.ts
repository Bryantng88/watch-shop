import * as z from 'zod';
export const CustomerDeleteManyResultSchema = z.object({
  count: z.number()
});