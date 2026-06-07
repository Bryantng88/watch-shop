import * as z from 'zod';
export const TaskDeleteManyResultSchema = z.object({
  count: z.number()
});